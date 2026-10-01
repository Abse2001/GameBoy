import { createHash } from "node:crypto"
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { chromium } from "@playwright/test"
import { applyRoutingPlan, manualPaths, manualTraceNames } from "./board-routing"
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

function electricalGroups(circuit: AnyCircuitElement[]): { sha256: string; portCount: number; groupCount: number } {
  const components = new Map(circuit.filter((element) => element.type === "source_component")
    .map((component) => [component.source_component_id, component.name]))
  const groups = new Map<string, string[]>()
  const ports = circuit.filter((element) => element.type === "source_port")
  for (const port of ports) {
    const key = port.subcircuit_connectivity_map_key || port.source_port_id
    const group = groups.get(key) ?? []
    group.push(JSON.stringify([port.source_port_id, components.get(port.source_component_id), port.name, port.pin_number]))
    groups.set(key, group)
  }
  const normalized = [...groups.values()].map((group) => JSON.stringify(group.sort())).sort()
  return { sha256: sha256(JSON.stringify(normalized)), portCount: ports.length, groupCount: groups.size }
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
  sourcePolicy: "Verified public registry release plus explicit board-routing.ts phase/manual-path edits; no private project files",
  executionPolicy: "Published tscircuit worker in Chromium; no platform overrides or route cache",
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
fsMap["index.circuit.tsx"] = applyRoutingPlan(fsMap["index.circuit.tsx"])
saveJson("candidate-filesystem-map.json", fsMap)
saveJson("routing-plan.json", {
  manualPaths, manualTraceNames, baselineSourceSha256: sourceHash,
  candidateSourceSha256: sha256(fsMap["index.circuit.tsx"]),
})

const clientBuild = await Bun.build({ entrypoints: [resolve("browser-client.ts")], target: "browser" })
if (!clientBuild.success) throw new AggregateError(clientBuild.logs, "Browser client build failed")
const clientJs = await clientBuild.outputs[0].text()
const server = Bun.serve({
  hostname: "127.0.0.1", port: 0,
  fetch(request): Response {
    const path = new URL(request.url).pathname
    if (path === "/worker.js") return new Response(Bun.file(workerPath), { headers: { "content-type": "text/javascript" } })
    if (path === "/client.js") return new Response(clientJs, { headers: { "content-type": "text/javascript" } })
    if (path === "/") return new Response('<!doctype html><script type="module" src="/client.js"></script>', { headers: { "content-type": "text/html" } })
    return new Response("Not found", { status: 404 })
  },
})
const browser = await chromium.launch({ headless: true })
saveJson("browser-runtime.json", { version: browser.version(), engine: "Chromium", workerSha256: actualWorkerHash })
const page = await browser.newPage()
const browserErrors: string[] = []
page.on("pageerror", (error): void => { browserErrors.push(String(error)) })
page.on("console", (message): void => {
  if (message.type() === "error") console.error("Browser:", message.text())
})
const routeStarts: RoutingEvent[] = []
const routeEnds: RoutingEvent[] = []
const routeErrors: RoutingEvent[] = []
let lastProgressLog = 0

await page.exposeFunction("captureRoutingEvent", (event: RoutingEvent): void => {
    const name = event.type
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

await page.goto(`http://127.0.0.1:${server.port}`)
await page.waitForFunction((): boolean => typeof (window as any).runBoard === "function")
const smoke = await page.evaluate(() => (window as any).runBoard(null))
saveJson("copper-pour-smoke.json", smoke)
if (smoke.renderFailure || smoke.asyncErrors.length || browserErrors.length) {
  await browser.close()
  server.stop()
  throw new Error("Browser copper-pour initialization failed; full routing was not started")
}

let renderFailure: unknown
let circuit: AnyCircuitElement[] = []
let asyncErrors: unknown[] = []
try {
  const result = await page.evaluate((source) => (window as any).runBoard(source), fsMap)
  circuit = result.circuit
  asyncErrors = result.asyncErrors
  if (result.renderFailure) renderFailure = result.renderFailure
} catch (error) {
  renderFailure = error
  saveJson("render-error.json", { message: String(error), stack: (error as Error).stack })
}

try {
  saveJson("circuit.json", circuit)
  saveJson("runtime-errors.json", { asyncErrors, browserErrors })
  const errors = circuit.filter((element) => element.type.includes("error"))
  saveJson("core-errors.json", errors)
  const errorsByType: Record<string, number> = {}
  for (const error of errors) errorsByType[error.type] = (errorsByType[error.type] ?? 0) + 1
  const pcbSvg = convertCircuitJsonToPcbSvg(circuit, { width: 1800, height: 1100 })
  writeFileSync(resolve(output, "board.svg"), pcbSvg)
  writeFileSync(resolve(output, "board.png"), new Resvg(pcbSvg).render().asPng())
  const summary = {
    renderCompleted: renderFailure === undefined && asyncErrors.length === 0 && browserErrors.length === 0,
    asyncErrors, browserErrors,
    elapsedMs: performance.now() - started,
    traceCount: circuit.filter((element) => element.type === "pcb_trace").length,
    viaCount: circuit.filter((element) => element.type === "pcb_via").length,
    coreErrorCount: errors.length, errorsByType,
    routeStarts, routeEnds, routeErrors,
    circuitSha256: sha256(JSON.stringify(circuit)),
    electricalGroups: electricalGroups(circuit),
  }
  saveJson("summary.json", summary)
  console.log(JSON.stringify(summary, null, 2))
  if (renderFailure) throw renderFailure
  if (asyncErrors.length || browserErrors.length) throw new Error("Browser/async render failure; see runtime-errors.json")
  if (summary.electricalGroups.sha256 !== "cf657997ed461937945f7ce12388db63506538672c5e7ca414158f89f718cebf") {
    throw new Error("Electrical port groups changed from the original public board")
  }
  if (routeStarts.length === 0 || routeStarts.length !== routeEnds.length || routeErrors.length > 0) {
    throw new Error("Routing did not complete every started phase successfully")
  }
  if (routeStarts.some((event) => !/Pipeline.*9|pipeline9/i.test(String(event.solverName)))) {
    throw new Error("Expected Pipeline 9 for every routing phase")
  }
  if (routeStarts.some((event) => event.cacheStatus !== "disabled")) {
    throw new Error("Unexpected route cache")
  }
  // Prior-phase copper and our explicit pcbPaths are deliberate, not cached
  // output from an earlier board run. All phase inputs/outputs are retained.
  if (routeStarts.length < 3) throw new Error("Expected multiple routing phases")
  for (const name of manualTraceNames) {
    const path = manualPaths[name]
    const sourceTrace = circuit.find((element) => element.type === "source_trace" && element.name === name)
    if (!sourceTrace || sourceTrace.type !== "source_trace") throw new Error(`Missing manual source trace ${name}`)
    const traces = circuit.filter((element) => element.type === "pcb_trace" && element.source_trace_id === sourceTrace.source_trace_id)
    if (traces.length !== 1 || traces[0].type !== "pcb_trace" || traces[0].route.length !== 3 || traces[0].route.some((point) => point.route_type !== "wire" || point.layer !== "top" || point.width !== path.width)) {
      throw new Error(`Manual path ${name} was not preserved`)
    }
    const intermediate = traces[0].route[1]
    const expectedIntermediate = path.waypoint ?? traces[0].route[2]
    if (intermediate.x !== expectedIntermediate.x || intermediate.y !== expectedIntermediate.y) {
      throw new Error(`Manual path ${name} waypoint was moved`)
    }
    const expectedPorts = sourceTrace.connected_source_port_ids.map((id) => circuit.find((element) => element.type === "pcb_port" && element.source_port_id === id))
    for (const port of expectedPorts) {
      if (!port || port.type !== "pcb_port" || !traces[0].route.some((point) => point.x === port.x && point.y === port.y)) {
        throw new Error(`Manual path ${name} no longer terminates at its original pads`)
      }
    }
  }
  if (errors.length > 0) throw new Error(`Rendered board has ${errors.length} Core errors; see artifacts`)
} finally {
  await browser.close()
  server.stop()
}
