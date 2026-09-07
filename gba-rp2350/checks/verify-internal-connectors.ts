import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import type { AnyCircuitElement } from "circuit-json"
import { getSourcePortConnectivityMapFromCircuitJson } from "circuit-json-to-connectivity-map"

type Placement = { name: string; center: { x: number; y: number }; rotation: number; layer: string }
type RouteReport = {
  componentCount: number
  componentNames: string[]
  parts: Array<{ name: string; [key: string]: unknown }>
  netlistSha256: string
  protectedPlacements: Placement[]
  bottomComponents: string[]
}
const near = (actual: number, expected: number, message: string) => {
  assert(Number.isFinite(actual) && Math.abs(actual - expected) < 1e-6, `${message}: expected ${expected}, got ${actual}`)
}

export function verifyBatteryCableCutout(elements: AnyCircuitElement[]) {
  assert.deepEqual(elements.filter(e => e.type === "pcb_hole" && !e.pcb_component_id), [], "The battery opening must not be duplicated as an NPTH drill slot")
  const cutouts = elements.filter(e => e.type === "pcb_cutout")
  assert.equal(cutouts.length, 1, "Expected exactly one native board-profile cutout")
  const slot = cutouts[0]!
  assert(slot.shape === "polygon", "Battery opening must be a native polygon cutout")
  assert(!slot.pcb_component_id, "Battery opening must not create a hidden component")
  assert.equal(slot.points.length, 67, "Expected 32 segments per semicircle plus explicit profile closure")
  assert.deepEqual(slot.points.at(-1), slot.points[0], "Battery cutout profile is not explicitly closed")
  const bounds = {
    left: Math.min(...slot.points.map(p => p.x)), right: Math.max(...slot.points.map(p => p.x)),
    bottom: Math.min(...slot.points.map(p => p.y)), top: Math.max(...slot.points.map(p => p.y)),
  }
  near(bounds.left, -24, "Slot left edge")
  near(bounds.right, -12, "Slot right edge")
  near(bounds.bottom, -22.5, "Slot bottom edge")
  near(bounds.top, -14.5, "Slot top edge")
  // Independent analytic capsule check: right semicircle followed by left,
  // with two 4 mm straight sections. Ordered points also reject self-crossings.
  for (let i = 0; i < 66; i++) {
    const isRight = i < 33
    const angle = (isRight ? -Math.PI / 2 : Math.PI / 2) + (i % 33) * Math.PI / 32
    const point = slot.points[i]!
    near(point.x, (isRight ? -16 : -20) + 4 * Math.cos(angle), `Slot vertex ${i} X`)
    near(point.y, -18.5 + 4 * Math.sin(angle), `Slot vertex ${i} Y`)
  }
  const maxChordError = 4 * (1 - Math.cos(Math.PI / 64))
  assert(maxChordError < 0.005, "Cutout approximation exceeds 0.005 mm")
  const center = { x: (bounds.left + bounds.right) / 2, y: (bounds.bottom + bounds.top) / 2 }
  const reserves = elements.filter(e => e.type === "pcb_keepout" && e.shape === "rect" &&
    Math.abs(e.center.x - center.x) < 1e-6 && Math.abs(e.center.y - center.y) < 1e-6)
  assert.equal(reserves.length, 1, "Expected one native copper-clearance keepout centered on the battery slot")
  const reserve = reserves[0]!
  assert(reserve.type === "pcb_keepout" && reserve.shape === "rect")
  near(reserve.width, bounds.right - bounds.left + 0.4, "Slot copper reserve width")
  near(reserve.height, bounds.top - bounds.bottom + 0.4, "Slot copper reserve height")
  assert.deepEqual([...reserve.layers].sort(), ["bottom", "inner1", "inner2", "top"], "Slot copper reserve must cover all four layers")
  assert.deepEqual(reserve.excluded_pcb_component_ids ?? [], [], "Slot copper reserve must not exempt component copper")
  assert.equal(reserve.subcircuit_id, slot.subcircuit_id, "Slot and copper reserve must share the board routing scope")
  return { slot, bounds, reserve }
}

export function verifyInternalConnectors(baselineFile: string, candidateFile: string, circuitFile: string) {
  const baseline: RouteReport = JSON.parse(readFileSync(baselineFile, "utf8"))
  const candidate: RouteReport = JSON.parse(readFileSync(candidateFile, "utf8"))
  const elements: AnyCircuitElement[] = JSON.parse(readFileSync(circuitFile, "utf8"))
  assert(Array.isArray(elements), "Expected Circuit JSON array")
  const components = elements.filter(e => e.type === "source_component")
  const pcbComponents = elements.filter(e => e.type === "pcb_component")
  const ports = elements.filter(e => e.type === "source_port")
  const names = components.map(c => c.name).sort()
  assert.equal(components.length, 113, "Expected the full restored-controls/storage GBA board")
  assert.equal(new Set(names).size, names.length, "Duplicate component names")
  assert.equal(pcbComponents.length, components.length, "Unexpected extra/missing PCB components")
  for (const c of components) {
    assert.equal(pcbComponents.filter(p => p.source_component_id === c.source_component_id).length, 1, `Expected one PCB component for ${c.name}`)
  }
  assert(pcbComponents.every(c => c.layer === "top"), "All components must remain on top")
  assert.equal(candidate.componentCount, components.length, "Candidate report does not match the circuit")
  assert.deepEqual(candidate.componentNames, names, "Candidate names/report mismatch")
  assert.deepEqual(baseline.componentNames, candidate.componentNames, "Components were added or removed")
  assert.equal(baseline.componentCount, candidate.componentCount)
  assert.deepEqual(candidate.bottomComponents, [])
  assert.deepEqual(baseline.bottomComponents, [])
  const parts = components.map(c => ({
    name: c.name, ftype: c.ftype, supplierPartNumbers: c.supplier_part_numbers,
    ...("resistance" in c ? { resistance: c.resistance } : {}),
    ...("capacitance" in c ? { capacitance: c.capacitance } : {}),
    ...("inductance" in c ? { inductance: c.inductance } : {}),
    ...("frequency" in c ? { frequency: c.frequency } : {}),
  })).sort((a, b) => a.name.localeCompare(b.name))
  assert.deepEqual(candidate.parts, JSON.parse(JSON.stringify(parts)), "Candidate parts/report mismatch")
  assert.deepEqual(candidate.parts, baseline.parts, "Part selections or values changed")

  const sourceById = new Map(components.map(c => [c.source_component_id, c]))
  assert.equal(sourceById.size, components.length, "Duplicate source component IDs")
  assert(ports.every(p => p.source_component_id && sourceById.has(p.source_component_id)), "Port without a source component")
  const connectivity = getSourcePortConnectivityMapFromCircuitJson(elements)
  const nets: string[][] = []
  const visited = new Set<string>()
  for (const port of ports) {
    if (visited.has(port.source_port_id)) continue
    const group = ports.filter(p => p.source_port_id === port.source_port_id || connectivity.areIdsConnected(port.source_port_id, p.source_port_id))
    for (const p of group) visited.add(p.source_port_id)
    nets.push(group.map(p => `${sourceById.get(p.source_component_id!)!.name}.${p.pin_number}`).sort())
  }
  nets.sort((a, b) => a.join().localeCompare(b.join()))
  const netlistSha256 = createHash("sha256").update(JSON.stringify(nets)).digest("hex")
  assert.equal(candidate.netlistSha256, netlistSha256, "Candidate netlist/report mismatch")
  assert.equal(baseline.netlistSha256, netlistSha256, "Electrical connectivity changed")
  function pcb(name: string) {
    const c = components.find(c => c.name === name)
    assert(c, `Missing ${name}`)
    const p = pcbComponents.find(p => p.source_component_id === c.source_component_id)
    assert(p, `Missing PCB placement for ${name}`)
    return p
  }
  const placements = components.filter(c => /^SW_|^J_|^X1$|^U1$|^U_PSRAM$/.test(c.name)).map(c => {
    const p = pcb(c.name)
    return { name: c.name, center: p.center, rotation: p.rotation, layer: p.layer }
  }).sort((a, b) => a.name.localeCompare(b.name))
  assert.deepEqual(candidate.protectedPlacements, placements, "Candidate protected placements/report mismatch")
  const movable = new Set(["J_BAT", "J_SPK"])
  assert.deepEqual(placements.filter(p => !movable.has(p.name)), baseline.protectedPlacements.filter(p => !movable.has(p.name)), "An unrelated protected placement changed")
  assert.deepEqual(placements.filter(p => movable.has(p.name)).map(p => p.name), ["J_BAT", "J_SPK"])
  for (const [name, x, y, rotation] of [["J_BAT", -18, -7, 180], ["J_SPK", 18, -10, 0]] as const) {
    const p = pcb(name)
    near(p.center.x, x, `${name} placement origin X`)
    near(p.center.y, y, `${name} placement origin Y`)
    near(p.rotation, rotation, `${name} rotation`)
    const old = baseline.protectedPlacements.find(p => p.name === name)
    assert(old, `Baseline missing ${name}`)
    assert.notDeepEqual({ center: p.center, rotation: p.rotation }, { center: old.center, rotation: old.rotation }, `${name} did not move`)
  }
  // Native placement origins are not necessarily the signal pin-row center.
  // Check individual pins too, so a mirrored/swapped footprint cannot pass.
  for (const [name, pin, x, y] of [
    ["J_BAT", 1, -18.97499805, -7], ["J_BAT", 2, -16.97500205, -7],
    ["J_SPK", 1, 17.000002, -7.21254685], ["J_SPK", 2, 18.999998, -7.21254685],
    ["J_SPK", 3, 21.350006, -12.23745425], ["J_SPK", 4, 14.649994, -12.23745425],
  ] as const) {
    const p = pcb(name)
    const matches = ports.filter(port => port.source_component_id === p.source_component_id && port.pin_number === pin)
    assert.equal(matches.length, 1, `Expected one ${name}.pin${pin}`)
    const physical = elements.filter(e => e.type === "pcb_port").filter(port => port.source_port_id === matches[0]!.source_port_id && port.pcb_component_id === p.pcb_component_id)
    assert.equal(physical.length, 1, `Expected one physical ${name}.pin${pin}`)
    near(physical[0]!.x, x, `${name}.pin${pin} X`)
    near(physical[0]!.y, y, `${name}.pin${pin} Y`)
  }

  const sourceBoards = elements.filter(e => e.type === "source_board")
  assert.equal(sourceBoards.length, 1, "Expected one root board")
  const groups = elements.filter(e => e.type === "source_group")
  const root = groups.find(g => g.source_group_id === sourceBoards[0]!.source_group_id)
  assert(root?.is_subcircuit && root.subcircuit_id, "Missing root routing scope")
  assert.deepEqual(groups.filter(g => g.is_subcircuit && g !== root), [], "Child subcircuits are not permitted")
  for (const e of elements.filter(e => e.type === "source_trace" || e.type === "pcb_trace")) {
    assert.equal(e.subcircuit_id, root.subcircuit_id, "Trace outside the global routing scope")
  }
  assert.deepEqual(elements.filter(e => e.type === "source_manually_placed_via" || e.type === "pcb_trace_hint"), [], "Explicit via/route-hint records are not permitted")
  const { slot, bounds: slotBounds } = verifyBatteryCableCutout(elements)
  assert.equal(slot.subcircuit_id, root.subcircuit_id)
  const boards = elements.filter(e => e.type === "pcb_board")
  assert.equal(boards.length, 1)
  const board = boards[0]!
  assert(typeof board.width === "number" && typeof board.height === "number", "Board dimensions must be explicit")
  near(board.width, 131.32, "Board width")
  near(board.height, 72.42, "Board height")
  near(board.center.x, 0, "Board center X")
  near(board.center.y, 0, "Board center Y")
  assert.equal(board.num_layers, 4)
  const left = board.center.x - board.width / 2, right = board.center.x + board.width / 2
  const bottom = board.center.y - board.height / 2, top = board.center.y + board.height / 2
  // The active GBA has a rectangular outline; reject a changed/concave outline
  // instead of treating its bounding rectangle as proof of slot containment.
  const outline = board.outline ?? []
  assert.equal(outline.length, 4, "Expected the unchanged rectangular board outline")
  assert(outline.every(p => (Math.abs(p.x - left) < 1e-6 || Math.abs(p.x - right) < 1e-6) && (Math.abs(p.y - bottom) < 1e-6 || Math.abs(p.y - top) < 1e-6)), "Board outline is not its declared rectangle")
  const area = Math.abs(outline.reduce((sum, p, i) => { const q = outline[(i + 1) % outline.length]!; return sum + p.x * q.y - q.x * p.y }, 0)) / 2
  near(area, board.width * board.height, "Board outline area")
  const edgeGap = Math.min(slotBounds.left - left, right - slotBounds.right, slotBounds.bottom - bottom, top - slotBounds.top)
  assert(edgeGap > (board.min_board_edge_clearance ?? 0), "Slot crosses or violates the board edge")
  console.log(`Internal-connector checks passed: unchanged parts/netlist/protected placements except J_BAT/J_SPK; top-only; closed native 12 x 8 mm capsule cutout inside the board by ${edgeGap.toFixed(3)} mm; chord error <0.005 mm; native 12.4 x 8.4 mm copper reserve on all four layers.`)
  console.log("Input integrity only—not a routing, shorts, mechanical mating or fabrication pass. Reports do not record every passive placement, and Circuit JSON alone cannot certify that no PCB paths were authored; review source and run the normal routing/shorts gates separately.")
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [baseline, candidate, circuit, ...extra] = process.argv.slice(2)
  assert(baseline && candidate && circuit && extra.length === 0, "Usage: bun checks/verify-internal-connectors.ts baseline-route-report.json candidate-route-report.json candidate-circuit.json")
  verifyInternalConnectors(baseline, candidate, circuit)
}
