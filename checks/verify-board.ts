import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { createHash } from "node:crypto"
import type { AnyCircuitElement } from "circuit-json"

const file = process.argv[2] ?? "dist/index/circuit.json"
const elements: AnyCircuitElement[] = JSON.parse(readFileSync(file, "utf8"))
const components = elements.filter((e) => e.type === "source_component")
const ports = elements.filter((e) => e.type === "source_port")
const traces = elements.filter((e) => e.type === "source_trace")
const parent = new Map<string, string>()

function root(id: string): string {
  const next = parent.get(id)
  if (!next || next === id) return id
  const result = root(next)
  parent.set(id, result)
  return result
}

for (const trace of traces) {
  const ids = [
    ...trace.connected_source_port_ids,
    ...trace.connected_source_net_ids,
  ]
  for (const id of ids.slice(1)) parent.set(root(id), root(ids[0]!))
}

function port(componentName: string, pin: string) {
  const component = components.find((e) => e.name === componentName)
  assert(component, `Missing component ${componentName}`)
  const result = ports.find(
    (p) =>
      p.source_component_id === component.source_component_id &&
      (p.name === pin || p.port_hints?.includes(pin)),
  )
  assert(result, `Missing port ${componentName}.${pin}`)
  return result
}

function sameNet(a: [string, string], b: [string, string]) {
  assert.equal(
    root(port(...a).source_port_id),
    root(port(...b).source_port_id),
    `${a.join(".")} and ${b.join(".")} must share a net`,
  )
}

sameNet(["J_USB", "A4B9"], ["D_USB_POWER", "anode"])
sameNet(["D_USB_POWER", "cathode"], ["U_3V3", "VIN"])
sameNet(["U_3V3", "VOUT"], ["U1", "VREG_VIN"])
sameNet(["U_3V3", "VOUT"], ["U2", "VCC"])
sameNet(["J_BAT", "pin1"], ["J_PWR_SW", "pin1"])
sameNet(["J_PWR_SW", "pin2"], ["Q_BAT_CUTOFF", "source"])
sameNet(["U1", "GPIO22"], ["R_AMP_IN", "pin1"])
for (const pin of ["IOVDD1", "IOVDD2", "IOVDD3", "IOVDD4", "IOVDD5", "IOVDD6", "QSPI_IOVDD", "USB_OTP_VDD", "ADC_AVDD"]) {
  sameNet(["U_3V3", "VOUT"], ["U1", pin])
}
for (const pin of ["DVDD1", "DVDD2", "DVDD3", "VREG_FB"]) {
  sameNet(["U_CORE_INDUCTOR", "pin2"], ["U1", pin])
}
for (const [button, gpio] of [["UP", "GPIO2"], ["DOWN", "GPIO3"], ["LEFT", "GPIO4"], ["RIGHT", "GPIO5"], ["A", "GPIO6"], ["B", "GPIO7"], ["X", "GPIO8"], ["Y", "GPIO9"], ["SELECT", "GPIO10"], ["START", "GPIO11"]]) {
  sameNet([`SW_${button}`, "pin1"], ["U1", gpio!])
  sameNet([`SW_${button}`, "pin4"], ["U1", "GND"])
}
for (const [lcdPin, gpio] of [["CS", "GPIO17"], ["RESET", "GPIO21"], ["DC_RS", "GPIO20"], ["SDI_MOSI", "GPIO19"], ["SCK", "GPIO18"], ["SDO_MISO", "GPIO16"]]) {
  sameNet(["J_HEADER", lcdPin!], ["U1", gpio!])
}
assert.notEqual(root(port("U_3V3", "VIN").source_port_id), root(port("U_3V3", "VOUT").source_port_id))
assert.notEqual(root(port("U_3V3", "GND").source_port_id), root(port("U_3V3", "VOUT").source_port_id))

type Point = { x: number; y: number }
function inside(point: Point, polygon: Point[]) {
  let contained = false
  for (let i = 0, k = polygon.length - 1; i < polygon.length; k = i++) {
    const a = polygon[i]!
    const b = polygon[k]!
    if ((a.y > point.y) !== (b.y > point.y) &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) {
      contained = !contained
    }
  }
  return contained
}

function sharedCopperRegion(a: [string, string], b: [string, string]) {
  const sourcePorts = [port(...a), port(...b)]
  const pcbPorts = sourcePorts.map((sourcePort) => {
    const pcbPort = elements.find((e) => e.type === "pcb_port" && e.source_port_id === sourcePort.source_port_id)
    assert(pcbPort?.type === "pcb_port")
    return pcbPort
  })
  const region = elements.find((e) =>
    e.type === "pcb_copper_pour" && e.shape === "brep" &&
    root(e.source_net_id) === root(sourcePorts[0]!.source_port_id) &&
    pcbPorts.every((p) =>
      p.layers.includes(e.layer) && inside(p, e.brep_shape.outer_ring.vertices) &&
      !e.brep_shape.inner_rings.some((hole) => inside(p, hole.vertices)),
    ),
  )
  assert(region, `No continuous same-net copper region connects ${a.join(".")} to ${b.join(".")}`)
}

sharedCopperRegion(["U_3V3", "VOUT"], ["C_3V3_OUT", "pin1"])
sharedCopperRegion(["U_CORE_INDUCTOR", "pin2"], ["C_CORE", "pin1"])

// This signature excludes generated IDs and grouping. It makes the
// hierarchical/flat comparison sensitive to actual electrical net changes.
const nets = new Map<string, string[]>()
for (const p of ports) {
  const component = components.find((c) => c.source_component_id === p.source_component_id)!
  const net = nets.get(root(p.source_port_id)) ?? []
  net.push(`${component.name}.${p.pin_number}`)
  nets.set(root(p.source_port_id), net)
}
const netlistSignature = createHash("sha256").update(
  JSON.stringify([...nets.values()].map((net) => net.sort()).sort((a, b) => a.join().localeCompare(b.join()))),
).digest("hex")

const errors = elements.filter((e) => e.type.endsWith("_error"))
const counts: Record<string, number> = {}
for (const error of errors) counts[error.type] = (counts[error.type] ?? 0) + 1
const criticalWarnings = elements.filter((e) =>
  e.type === "pcb_trace_too_long_warning" || e.type === "source_pin_missing_trace_warning",
)
console.log(JSON.stringify({
  file,
  functionalNetlistChecks: "passed",
  localPowerCopperConnections: "passed",
  netlistSignature,
  pcbTraces: elements.filter((e) => e.type === "pcb_trace").length,
  pcbVias: elements.filter((e) => e.type === "pcb_via").length,
  copperRegions: elements.filter((e) => e.type === "pcb_copper_pour").length,
  errors: counts,
  criticalWarnings,
}, null, 2))
assert.equal(errors.length, 0, "Board is NOT ready: routing/DRC errors remain")
assert.equal(criticalWarnings.length, 0, "Board is NOT ready: trace-length or missing-connection warnings remain")
