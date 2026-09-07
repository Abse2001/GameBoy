import assert from "node:assert/strict"
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs"
import { createHash } from "node:crypto"
import { dirname, join } from "node:path"
import { getSourcePortConnectivityMapFromCircuitJson } from "circuit-json-to-connectivity-map"
import type { AnyCircuitElement } from "circuit-json"

const [file, reportPath] = process.argv.slice(2)
assert(file && reportPath, "Usage: route-report.ts circuit.json report.json")
const elements: AnyCircuitElement[] = JSON.parse(readFileSync(file, "utf8"))
const components = elements.filter(e => e.type === "source_component")
const ports = elements.filter(e => e.type === "source_port")
const pcbComponents = elements.filter(e => e.type === "pcb_component")
const connectivity = getSourcePortConnectivityMapFromCircuitJson(elements)
const connectedPorts: string[][] = []
const used = new Set<string>()
for (const port of ports) {
  if (used.has(port.source_port_id)) continue
  const group = ports.filter(p => p.source_port_id === port.source_port_id || connectivity.areIdsConnected(port.source_port_id, p.source_port_id))
  for (const p of group) used.add(p.source_port_id)
  connectedPorts.push(group.map(p => `${components.find(c => c.source_component_id === p.source_component_id)?.name}.${p.pin_number}`).sort())
}
const sortedNets = connectedPorts.sort((a, b) => a.join().localeCompare(b.join()))
const errors = elements.filter(e => e.type.endsWith("_error"))
const warnings = elements.filter(e => e.type.endsWith("_warning"))
const criticalWarnings = warnings.filter(e => e.type === "pcb_trace_too_long_warning" || e.type === "source_pin_missing_trace_warning")
const countByType = (items: AnyCircuitElement[]): Record<string, number> => {
  const counts: Record<string, number> = {}
  for (const item of items) counts[item.type] = (counts[item.type] ?? 0) + 1
  return counts
}
const protectedNames = components.filter(c => /^SW_|^J_|^X1$|^U1$|^U_PSRAM$/.test(c.name)).map(c => c.name)
const protectedPlacements = protectedNames.map(name => {
  const component = components.find(c => c.name === name)!
  const pcb = pcbComponents.find(p => p.source_component_id === component.source_component_id)
  assert(pcb, `Missing PCB component ${name}`)
  return { name, center: pcb.center, rotation: pcb.rotation, layer: pcb.layer }
}).sort((a, b) => a.name.localeCompare(b.name))
const report = {
  file,
  componentCount: components.length,
  componentNames: components.map(c => c.name).sort(),
  parts: components.map(c => ({
    name: c.name,
    ftype: c.ftype,
    supplierPartNumbers: c.supplier_part_numbers,
    ...("resistance" in c ? { resistance: c.resistance } : {}),
    ...("capacitance" in c ? { capacitance: c.capacitance } : {}),
    ...("inductance" in c ? { inductance: c.inductance } : {}),
    ...("frequency" in c ? { frequency: c.frequency } : {}),
  })).sort((a, b) => a.name.localeCompare(b.name)),
  netlistSha256: createHash("sha256").update(JSON.stringify(sortedNets)).digest("hex"),
  protectedPlacements,
  bottomComponents: pcbComponents.filter(c => c.layer !== "top").map(c => components.find(s => s.source_component_id === c.source_component_id)?.name),
  pcbTraces: elements.filter(e => e.type === "pcb_trace").length,
  pcbVias: elements.filter(e => e.type === "pcb_via").length,
  copperRegions: elements.filter(e => e.type === "pcb_copper_pour").length,
  errors: countByType(errors),
  errorCount: errors.length,
  errorDetails: errors,
  warnings: countByType(warnings),
  criticalWarningCount: criticalWarnings.length,
  criticalWarnings,
}
writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n")
if (process.env.GITHUB_OUTPUT) {
  const routeReady = report.pcbTraces > 0 && !(report.errors.pcb_autorouting_error > 0)
  appendFileSync(process.env.GITHUB_OUTPUT, `route_ready=${routeReady}\n`)
}
// Keep a readable, complete copy even if GitHub's artifact storage is full.
console.log("GBA_ROUTE_REPORT_START")
console.log(JSON.stringify(report, null, 2))
console.log("GBA_ROUTE_REPORT_END")
// Preserve the actual generated copper for inspection without artifact uploads.
console.log("GBA_CIRCUIT_JSON_START")
console.log(JSON.stringify(elements, null, 2))
console.log("GBA_CIRCUIT_JSON_END")

// Keep the CLI-generated PCB image reviewable when artifact storage is full.
const pcbSvgPath = join(dirname(file), "pcb.svg")
if (existsSync(pcbSvgPath)) {
  console.log("GBA_PCB_SVG_START")
  console.log(readFileSync(pcbSvgPath, "utf8"))
  console.log("GBA_PCB_SVG_END")
}
