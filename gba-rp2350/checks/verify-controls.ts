import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import type { AnyCircuitElement } from "circuit-json"
import { getSourcePortConnectivityMapFromCircuitJson } from "circuit-json-to-connectivity-map"

const [file, baselineFile] = process.argv.slice(2)
assert(file, "Usage: verify-controls.ts circuit.json [original-circuit.json]")
const elements: AnyCircuitElement[] = JSON.parse(readFileSync(file, "utf8"))
const components = elements.filter(e => e.type === "source_component")
const ports = elements.filter(e => e.type === "source_port")
const connectivity = getSourcePortConnectivityMapFromCircuitJson(elements)
function component(name: string) {
  const matches = components.filter(e => e.name === name)
  assert.equal(matches.length, 1, `Expected one ${name}`)
  return matches[0]!
}
function port(name: string, pin: string) {
  const c = component(name)
  const p = ports.find(e => e.source_component_id === c.source_component_id &&
    (e.name === pin || e.port_hints?.includes(pin)))
  assert(p, `Missing ${name}.${pin}`)
  return p.source_port_id
}
function same(a: [string, string], b: [string, string]) {
  assert(connectivity.areIdsConnected(port(...a), port(...b)), `${a.join(".")} must connect to ${b.join(".")}`)
}
function different(a: [string, string], b: [string, string]) {
  assert(!connectivity.areIdsConnected(port(...a), port(...b)), `${a.join(".")} must remain separate from ${b.join(".")}`)
}

for (const [sw, resistor, gpio] of [["SW_L", "R_L_PULLUP", "GPIO28_ADC2"], ["SW_R", "R_R_PULLUP", "GPIO8"]]) {
  same([sw!, "pin2"], ["U1", gpio!])
  same([sw!, "pin1"], [sw!, "pin3"])
  same([sw!, "pin1"], ["U1", "GND"])
  different([sw!, "pin1"], [sw!, "pin2"])
  same([resistor!, "pin1"], [sw!, "pin2"])
  same([resistor!, "pin2"], ["U_3V3", "VOUT"])
  assert(component(sw!).supplier_part_numbers?.jlcpcb?.includes("C110293"))
  const r = component(resistor!)
  assert(r.ftype === "simple_resistor" && r.resistance === 10_000)
}
same(["J_SPI", "CS"], ["U1", "GPIO22"])
same(["J_HEADER", "CS"], ["U1", "GPIO17"])
same(["J_SD", "CS"], ["U1", "GPIO1"])
different(["J_SPI", "CS"], ["J_HEADER", "CS"])
different(["J_SPI", "CS"], ["J_SD", "CS"])
same(["R_SPI_CS_PULLUP", "pin1"], ["J_SPI", "CS"])
same(["R_SPI_CS_PULLUP", "pin2"], ["U_3V3", "VOUT"])

same(["R_AMP_IN", "pin2"], ["C_AMP_PWM_FILTER", "pin1"])
same(["R_AMP_IN", "pin2"], ["C_VOLUME_IN", "pin1"])
same(["C_VOLUME_IN", "pin2"], ["RV_VOLUME", "pin3"])
same(["RV_VOLUME", "pin2"], ["C_AMP_IN_COUPLE", "pin1"])
same(["C_AMP_IN_COUPLE", "pin2"], ["U_SPK_AMP", "INL"])
same(["RV_VOLUME", "pin1"], ["U1", "GND"])
different(["R_AMP_IN", "pin2"], ["RV_VOLUME", "pin3"])
different(["RV_VOLUME", "pin2"], ["U_SPK_AMP", "INL"])
assert(component("RV_VOLUME").supplier_part_numbers?.jlcpcb?.includes("C231765"))
const cap = component("C_VOLUME_IN")
assert(cap.ftype === "simple_capacitor" && cap.capacitance === 1e-6)
assert(cap.supplier_part_numbers?.jlcpcb?.includes("C15849"))

if (baselineFile) {
  const baseline: AnyCircuitElement[] = JSON.parse(readFileSync(baselineFile, "utf8"))
  const oldComponents = baseline.filter(e => e.type === "source_component")
  const oldPorts = baseline.filter(e => e.type === "source_port")
  const oldMap = getSourcePortConnectivityMapFromCircuitJson(baseline)
  const allowedReconnections = new Set(["J_SPI.CS", "C_AMP_IN_COUPLE.pin1"])
  const mapped = oldPorts.flatMap(p => {
    const c = oldComponents.find(c => c.source_component_id === p.source_component_id)!
    if (allowedReconnections.has(`${c.name}.${p.name}`) ||
      (c.name === "C_AMP_IN_COUPLE" && p.port_hints?.includes("pin1"))) return []
    return [{ old: p.source_port_id, current: port(c.name, p.name) }]
  })
  for (let i = 0; i < mapped.length; i++) for (let j = i + 1; j < mapped.length; j++) {
    const a = mapped[i]!, b = mapped[j]!
    assert.equal(connectivity.areIdsConnected(a.current, b.current), oldMap.areIdsConnected(a.old, b.old),
      `An unrelated original connection changed: ${a.old}, ${b.old}`)
  }
}
console.log("Restored L/R, AC-coupled volume wheel, and independent LCD/SD/SPI selects: netlist checks passed.")
console.log("This verifies source connectivity only, not physical DRCs, shorts, or housing fit.")
