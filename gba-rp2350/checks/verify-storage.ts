import assert from "node:assert/strict"
import { readFileSync, statSync } from "node:fs"
import { resolve } from "node:path"
import type { AnyCircuitElement } from "circuit-json"
import { getSourcePortConnectivityMapFromCircuitJson } from "circuit-json-to-connectivity-map"
import { gbaReferenceButtonPlacements } from "../experiments/fabrication/GbaReferenceButtonContacts.circuit"

const file = process.argv[2] ?? "dist/experiments/fabrication/placement-published-mcu-header-module/circuit.json"
const elements: AnyCircuitElement[] = JSON.parse(readFileSync(file, "utf8"))
const components = elements.filter((e) => e.type === "source_component")
const ports = elements.filter((e) => e.type === "source_port")
const connectivity = getSourcePortConnectivityMapFromCircuitJson(elements)

// Phases may sequence board-level connections, but none of this board's
// functional groups may create an independently routed child subcircuit.
const sourceBoards = elements.filter((e) => e.type === "source_board")
assert.equal(sourceBoards.length, 1, "Expected exactly one root board")
const sourceGroups = elements.filter((e) => e.type === "source_group")
const rootGroup = sourceGroups.find((g) => g.source_group_id === sourceBoards[0]!.source_group_id)
assert(rootGroup?.is_subcircuit, "Missing root board routing scope")
const childSubcircuits = sourceGroups.filter((g) => g.is_subcircuit && g !== rootGroup)
assert.deepEqual(childSubcircuits.map((g) => g.name ?? g.source_group_id), [], "Use ordinary groups, not child subcircuits")
for (const trace of elements.filter((e) => e.type === "source_trace" || e.type === "pcb_trace")) {
  assert.equal(trace.subcircuit_id, rootGroup.subcircuit_id, "Every trace must belong to the root board routing scope")
}

function component(name: string) {
  const matches = components.filter((c) => c.name === name)
  assert.equal(matches.length, 1, `Expected exactly one ${name}`)
  return matches[0]!
}

function port(name: string, pin: string) {
  const id = component(name).source_component_id
  const p = ports.find((p) => p.source_component_id === id &&
    (p.name === pin || p.port_hints?.includes(pin)))
  assert(p, `Missing ${name}.${pin}`)
  return p.source_port_id
}

function same(a: [string, string], b: [string, string]) {
  assert(connectivity.areIdsConnected(port(...a), port(...b)), `${a.join(".")} must connect to ${b.join(".")}`)
}

function different(a: [string, string], b: [string, string]) {
  assert(!connectivity.areIdsConnected(port(...a), port(...b)), `${a.join(".")} must NOT connect to ${b.join(".")}`)
}

function isInsidePolygon(point: { x: number; y: number }, polygon: { x: number; y: number }[]) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i]!
    const b = polygon[j]!
    if ((a.y > point.y) !== (b.y > point.y) &&
      point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside
  }
  return inside
}

// APS6404L-3SQR-SN SOP-8: shared QMI data/clock and separate CS1 on GPIO0.
same(["U_PSRAM", "pin1"], ["U1", "GPIO0"])
same(["U_PSRAM", "pin2"], ["U1", "QSPI_SD1"])
same(["U_PSRAM", "pin3"], ["U1", "QSPI_SD2"])
same(["U_PSRAM", "pin4"], ["U1", "GND"])
same(["U_PSRAM", "pin5"], ["U1", "QSPI_SD0"])
same(["U_PSRAM", "pin6"], ["U1", "QSPI_SCLK"])
same(["U_PSRAM", "pin7"], ["U1", "QSPI_SD3"])
same(["U_PSRAM", "pin8"], ["U1", "QSPI_IOVDD"])
same(["U_PSRAM", "pin8"], ["U_3V3", "VOUT"])
different(["U_PSRAM", "pin1"], ["U2", "CS"])
same(["R_PSRAM_CS", "pin1"], ["U_PSRAM", "pin1"])
same(["R_PSRAM_CS", "pin2"], ["U_PSRAM", "pin8"])

// SPI0 is shared with the display; the card has its own CS and detect GPIO.
for (const [sd, gpio, lcd] of [
  ["CLK", "GPIO18", "SCK"],
  ["MOSI", "GPIO19", "SDI_MOSI"],
  ["MISO", "GPIO16", "SDO_MISO"],
] as const) {
  same(["J_SD", sd], ["U1", gpio])
  same(["J_SD", sd], ["J_HEADER", lcd])
}
same(["J_SD", "CS"], ["U1", "GPIO1"])
same(["J_SD", "CD"], ["U1", "GPIO14"])
same(["J_SD", "VDD"], ["U_3V3", "VOUT"])
for (const pin of ["VSS", "GND1", "GND2", "GND3", "GND4"]) same(["J_SD", pin], ["U1", "GND"])
for (const [resistor, pin] of [
  ["R_SD_DAT2", "DAT2"], ["R_SD_CS", "CS"], ["R_SD_CMD", "MOSI"],
  ["R_SD_DAT0", "MISO"], ["R_SD_DAT1", "DAT1"], ["R_SD_CD", "CD"],
] as const) {
  same([resistor, "pin1"], ["J_SD", pin])
  same([resistor, "pin2"], ["J_SD", "VDD"])
  const r = component(resistor)
  assert(r.ftype === "simple_resistor")
  assert.equal(r.resistance, 10_000)
}
for (const [esd, sd] of [["pin1", "CS"], ["pin3", "MOSI"], ["pin4", "CLK"], ["pin6", "MISO"]] as const) same(["U_SD_ESD", esd], ["J_SD", sd])
same(["U_SD_ESD", "pin2"], ["J_SD", "VSS"])
same(["U_SD_ESD", "pin5"], ["J_SD", "VDD"])

for (const [cap, load, capacitance] of [
  ["C_PSRAM_BULK", "U_PSRAM", 1e-6], ["C_PSRAM_HF", "U_PSRAM", 1e-7],
  ["C_SD_BULK", "J_SD", 1e-5], ["C_SD_HF", "J_SD", 1e-7],
] as const) {
  same([cap, "pin1"], [load, "VDD"])
  same([cap, "pin2"], ["U1", "GND"])
  const c = component(cap)
  assert(c.ftype === "simple_capacitor")
  assert.equal(c.capacitance, capacitance)
}

// These are intentional distinct signal/supply nets, not copper-clearance tests.
const separate: [string, string][] = [
  ["J_SD", "CLK"], ["J_SD", "MOSI"], ["J_SD", "MISO"], ["J_SD", "CS"],
  ["J_SD", "CD"], ["J_SD", "DAT1"], ["J_SD", "DAT2"], ["J_SD", "VDD"],
  ["U1", "GND"], ["U1", "VREG_FB"], ["U1", "GPIO0"], ["U2", "CS"], ["J_HEADER", "CS"],
  ["U1", "QSPI_SD0"], ["U1", "QSPI_SD1"], ["U1", "QSPI_SD2"], ["U1", "QSPI_SD3"], ["U1", "QSPI_SCLK"],
]
for (let i = 0; i < separate.length; i++) for (let j = i + 1; j < separate.length; j++) different(separate[i]!, separate[j]!)

const parts = {
  U_3V3: "C51118",
  U_PSRAM: "C5333729", J_SD: "C91145", U_SD_ESD: "C85364",
  C_PSRAM_BULK: "C15849", C_PSRAM_HF: "C1525", R_PSRAM_CS: "C25744",
  C_SD_BULK: "C19702", C_SD_HF: "C1525", R_SD_DAT2: "C25744",
  R_SD_CS: "C25744", R_SD_CMD: "C25744", R_SD_DAT0: "C25744",
  R_SD_DAT1: "C25744", R_SD_CD: "C25744",
}
for (const [name, part] of Object.entries(parts)) {
  const c = component(name)
  assert(c.supplier_part_numbers?.jlcpcb?.includes(part), `${name}: wrong JLC part`)
  const cad = elements.find((e) => e.type === "cad_component" && e.source_component_id === c.source_component_id)
  assert(cad?.type === "cad_component", `${name}: missing CAD model`)
  for (const url of [cad.model_obj_url, cad.model_step_url]) {
    assert(url && url.startsWith("./experiments/fabrication/imports/"), `${name}: expected local imported model`)
    assert(statSync(resolve(url)).size > 0, `${name}: empty CAD file`)
  }
}
const sd = elements.find((e) => e.type === "pcb_component" && e.source_component_id === component("J_SD").source_component_id)
assert(sd?.type === "pcb_component")
assert.equal(sd.rotation % 360, 0)
const board = elements.find((e) => e.type === "pcb_board")
assert(board?.type === "pcb_board")
const { width: boardWidth, height: boardHeight } = board
assert(boardWidth !== undefined && boardHeight !== undefined)
const isGbaHousingEnvelope = Math.abs(boardWidth - 131.32) < 1e-6 && Math.abs(boardHeight - 72.42) < 1e-6
assert.equal(sd.center.x, isGbaHousingEnvelope ? 46 : 34)
assert(Math.abs(sd.center.y - (isGbaHousingEnvelope ? -29 : -33.7)) < 1e-6)

for (const [name, x, y] of [
  ["SW_UP", -56.7, 13.3], ["SW_DOWN", -54.5, -4.8], ["SW_LEFT", -64.7, 5.4], ["SW_RIGHT", -46.5, 5.4],
  ["SW_A", 57.2, 6.2], ["SW_B", 44.1, 1.8],
  ["SW_SELECT", -45.2, -22.7], ["SW_START", -45.2, -14.6],
] as const) {
  const pcb = elements.find((e) => e.type === "pcb_component" && e.source_component_id === component(name).source_component_id)
  assert(pcb?.type === "pcb_component")
  const placementX = typeof pcb.display_offset_x === "number" ? pcb.display_offset_x : pcb.center.x
  const placementY = typeof pcb.display_offset_y === "number" ? pcb.display_offset_y : pcb.center.y
  const reference = gbaReferenceButtonPlacements[name.slice(3) as keyof typeof gbaReferenceButtonPlacements]
  const expected = isGbaHousingEnvelope ? reference : { pcbX: x, pcbY: y }
  assert(Math.abs(placementX - expected.pcbX) < 1e-5 && Math.abs(placementY - expected.pcbY) < 1e-5, `${name}: protected placement changed`)
  if (isGbaHousingEnvelope) {
    assert(pcb.do_not_place, `${name}: PCB contact must not be in assembly placement`)
    different([name, "signal"], [name, "ground"])
    const contactPads = elements.filter((e) => e.type === "pcb_smtpad" && e.pcb_component_id === pcb.pcb_component_id)
    for (const pad of contactPads) {
      assert(pad.type === "pcb_smtpad")
      assert(pad.shape === "polygon", `${name}: expected reference copper polygon`)
      const pcbPort = elements.find((e) => e.type === "pcb_port" && e.pcb_port_id === pad.pcb_port_id)
      assert(pcbPort?.type === "pcb_port")
      assert(isInsidePolygon(pcbPort, pad.points), `${name}: routing endpoint must lie in its own copper, not a contact gap`)
      assert(!pad.is_covered_with_solder_mask, `${name}: contact copper must be exposed`)
      assert(!elements.some((e) => e.type === "pcb_solder_paste" && e.pcb_smtpad_id === pad.pcb_smtpad_id), `${name}: contact must have no solder paste`)
    }
    for (const p of ports.filter((p) => p.source_component_id === component(name).source_component_id)) {
      const alias = p.port_hints?.find((hint) => hint.startsWith("signal_aux") || hint.startsWith("ground_aux"))
      if (alias) same([name, alias], [name, alias.startsWith("signal") ? "signal" : "ground"])
    }
  }
}
const pcbComponent = (name: string) => {
  const pcb = elements.find((e) => e.type === "pcb_component" && e.source_component_id === component(name).source_component_id)
  assert(pcb?.type === "pcb_component")
  return pcb
}
const mcu = pcbComponent("U1")
const crystal = pcbComponent("X1")
for (const name of ["TP_SWCLK", "TP_SWDIO", "TP_GND", "TP_3V3"]) {
  const pcb = pcbComponent(name)
  assert(pcb.do_not_place, `${name}: bare PCB test pad must not be an assembled part`)
}
assert(Math.abs(crystal.center.x - mcu.center.x) < 1e-6, "Crystal must stay aligned with the MCU")
assert(Math.abs(crystal.center.y - mcu.center.y - 7.4) < 1e-6, "Crystal-to-MCU placement changed")
assert(!components.some((c) => c.name === "SW_X" || c.name === "SW_Y"), "Original GBA housing has no X/Y face buttons")

const errors = elements.filter((e) => e.type.endsWith("_error"))
const errorCounts: Record<string, number> = {}
for (const e of errors) errorCounts[e.type] = (errorCounts[e.type] ?? 0) + 1
console.log(JSON.stringify({ file, storageNetlistChecks: "passed", importedPartsWithLocalObjAndStep: Object.keys(parts).length,
  routingHierarchyChecks: "passed: one root board, no child subcircuits; board-level phases allowed",
  pcbTraces: elements.filter((e) => e.type === "pcb_trace").length,
  errors: errorCounts,
  note: "Netlist checks do not certify physical copper continuity or zero shorts. Run tsci check shorts and inspect routing DRCs separately."
}, null, 2))
