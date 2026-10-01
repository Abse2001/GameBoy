import { createHash } from "node:crypto"
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { createCircuitWebWorker } from "tscircuit"
import { convertCircuitJsonToPcbSvg } from "circuit-to-svg"
import { Resvg } from "@resvg/resvg-js"
import type { AnyCircuitElement } from "circuit-json"

const output = resolve("artifacts")
mkdirSync(output, { recursive: true })
const releaseId = "3fc1847a-a2c1-4ec4-8007-4d05f8f430a4"
const sourceHash = "292198edb424a001e102b94a68079d68fb27ab20303434f010882c607096584a"
const workerHash = "895c2eb60f90eb0e702ee87767f05222db04580e0d33847e3785d5bc56405940"
const started = performance.now()
type RoutingEvent = {
  type: string
  solverName?: string
  autorouterName?: string
  autorouterVersion?: string
  cacheStatus?: string
  previousTraceCount?: number
  simpleRouteJson?: { connections: unknown[]; obstacles: unknown[]; traces?: unknown[] }
  [key: string]: unknown
}

function sha256(content: string | Uint8Array): string {
  return createHash("sha256").update(content).digest("hex")
}

function saveJson(name: string, content: unknown): void {
  writeFileSync(resolve(output, name), JSON.stringify(content, null, 2))
}

function readPackage(name: string): { version: string; path: string } {
  let directory = dirname(import.meta.resolve(name).replace(/^file:\/\//, ""))
  while (directory !== dirname(directory)) {
    const manifestPath = resolve(directory, "package.json")
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"))
      if (manifest.name === name) return { version: manifest.version, path: directory }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
    }
    directory = dirname(directory)
  }
  throw new Error(`Cannot find installed package manifest for ${name}`)
}

const packages = Object.fromEntries([
  "tscircuit", "@tscircuit/eval", "@tscircuit/core",
  "@tscircuit/capacity-autorouter", "@tscircuit/checks", "circuit-to-svg",
].map((name) => [name, readPackage(name)]))
if (packages.tscircuit.version !== "0.0.2707") throw new Error("Unexpected tscircuit release")
const workerPath = resolve(packages.tscircuit.path, "dist/webworker.min.js")
const actualWorkerHash = sha256(readFileSync(workerPath))
if (actualWorkerHash !== workerHash) throw new Error("Published routing worker bytes changed")
saveJson("provenance.json", {
  packageName: "abse/gameboy-advance", packageVersion: "0.0.12", releaseId,
  tscircuit: "0.0.2707", packages, bun: Bun.version, workerPath,
  workerSha256: actualWorkerHash, sourceSha256: sourceHash,
  sourcePolicy: "Fetch the public registry release unchanged; no local project files",
  executionPolicy: "Published tscircuit eval worker; no platform overrides or route cache",
})

const response = await fetch(`https://registry-api.tscircuit.com/package_releases/get_filesystem_map?package_release_id=${releaseId}`)
if (!response.ok) throw new Error(`Public source download failed: ${response.status}`)
const source = await response.json() as { ok: boolean; filesystem_map: Record<string, string> }
if (!source.ok || !source.filesystem_map) throw new Error("Missing public filesystem map")
const fsMap = source.filesystem_map
const fsMapHash = sha256(JSON.stringify(Object.keys(fsMap).sort().map((name) => [name, fsMap[name]])))
if (fsMapHash !== "f42ae1377daa1f5b0c17c68bbade896fe532b75912f66aa97e838664a75e31f2") {
  throw new Error("Public release files changed since inspection")
}
if (sha256(fsMap["index.circuit.tsx"]) !== sourceHash) throw new Error("Public board source changed")
saveJson("public-filesystem-map.json", fsMap)
saveJson("source-hashes.json", Object.fromEntries(Object.entries(fsMap).map(([name, text]) => [name, sha256(text)])))
const sourceManifest = JSON.parse(fsMap["package.json"])
if (sourceManifest.main !== "index.circuit.tsx") throw new Error("Unexpected board entrypoint")

const worker = await createCircuitWebWorker({ webWorkerUrl: new URL(`file://${workerPath}`) })
const routeStarts: RoutingEvent[] = []
const routeEnds: RoutingEvent[] = []
const routeErrors: RoutingEvent[] = []
let lastProgressLog = 0

for (const name of ["autorouting:start", "autorouting:progress", "autorouting:end", "autorouting:error"] as const) {
  worker.on(name, (event: RoutingEvent): void => {
    const elapsedMs = performance.now() - started
    if (name === "autorouting:progress" && elapsedMs - lastProgressLog < 15000) return
    if (name === "autorouting:progress") lastProgressLog = elapsedMs
    const { simpleRouteJson, debugGraphics, pcbTracePaths, ...metadata } = event
    appendFileSync(resolve(output, "events.jsonl"), `${JSON.stringify({ elapsedMs, ...metadata })}\n`)
    console.log(JSON.stringify({ elapsedMs, ...metadata }))
    if (name === "autorouting:start") {
      routeStarts.push(metadata as RoutingEvent)
      saveJson(`input-${routeStarts.length}.srj.json`, simpleRouteJson)
    }
    if (name === "autorouting:end") {
      routeEnds.push(metadata as RoutingEvent)
      saveJson(`output-${routeEnds.length}.srj.json`, simpleRouteJson)
    }
    if (name === "autorouting:error") routeErrors.push(metadata as RoutingEvent)
  })
}

let renderFailure: unknown
try {
  await worker.executeWithFsMap({ fsMap, mainComponentPath: sourceManifest.main })
  await worker.renderUntilSettled()
} catch (error) {
  renderFailure = error
  saveJson("render-error.json", { message: String(error), stack: (error as Error).stack })
}

try {
  const circuit = await worker.getCircuitJson() as AnyCircuitElement[]
  saveJson("circuit.json", circuit)
  const errors = circuit.filter((element) => element.type.includes("error"))
  saveJson("core-errors.json", errors)
  const errorsByType: Record<string, number> = {}
  for (const error of errors) errorsByType[error.type] = (errorsByType[error.type] ?? 0) + 1
  const pcbSvg = convertCircuitJsonToPcbSvg(circuit, { width: 1800, height: 1100 })
  writeFileSync(resolve(output, "board.svg"), pcbSvg)
  writeFileSync(resolve(output, "board.png"), new Resvg(pcbSvg).render().asPng())
  const summary = {
    renderCompleted: renderFailure === undefined,
    elapsedMs: performance.now() - started,
    traceCount: circuit.filter((element) => element.type === "pcb_trace").length,
    viaCount: circuit.filter((element) => element.type === "pcb_via").length,
    coreErrorCount: errors.length, errorsByType,
    routeStarts, routeEnds, routeErrors,
    circuitSha256: sha256(JSON.stringify(circuit)),
  }
  saveJson("summary.json", summary)
  console.log(JSON.stringify(summary, null, 2))
  if (renderFailure) throw renderFailure
  if (routeStarts.length === 0 || routeStarts.length !== routeEnds.length || routeErrors.length > 0) {
    throw new Error("Routing did not complete every started phase successfully")
  }
  if (routeStarts.some((event) => !/Pipeline.*9|pipeline9/i.test(String(event.solverName)))) {
    throw new Error("Expected Pipeline 9 for every routing phase")
  }
  if (routeStarts.some((event) => event.cacheStatus !== "disabled" || event.previousTraceCount !== 0)) {
    throw new Error("Unexpected route cache or preloaded copper")
  }
  if (errors.length > 0) throw new Error(`Rendered board has ${errors.length} Core errors; see artifacts`)
} finally {
  await worker.kill()
}
