import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import type { AnyCircuitElement } from "circuit-json"

const [beforeFile, afterFile, ...extra] = process.argv.slice(2)
assert(beforeFile && afterFile && !extra.length, "Usage: verify-route-input.ts preflight.json routed.json")
const read = (file: string): AnyCircuitElement[] => JSON.parse(readFileSync(file, "utf8"))
const before = read(beforeFile), after = read(afterFile)
assert(!before.some(e => e.type === "pcb_trace" || e.type === "pcb_via"), "Expected unrouted input")
assert(after.some(e => e.type === "pcb_trace"), "Expected actual routed output")

function inputIdentity(elements: AnyCircuitElement[]) {
  const components = elements.filter(e => e.type === "source_component")
  const names = new Map(components.map(e => [e.source_component_id, e.name]))
  const placements = elements.filter(e => e.type === "pcb_component").map(e => ({
    name: names.get(e.source_component_id), center: e.center,
    rotation: e.rotation, layer: e.layer,
  })).sort((a, b) => a.name!.localeCompare(b.name!))
  const traceConstraints = elements.filter(e => e.type === "source_trace").map(e => ({
    id: e.source_trace_id, name: e.name, maxLength: e.max_length, maxViaCount: e.max_via_count,
  })).sort((a, b) => a.id.localeCompare(b.id))
  const decouplingConstraints = components.map(e => ({
    name: e.name,
    maxLength: "max_decoupling_trace_length" in e ? e.max_decoupling_trace_length : undefined,
  })).sort((a, b) => a.name.localeCompare(b.name))
  return { placements, traceConstraints, decouplingConstraints }
}

assert.deepEqual(inputIdentity(after), inputIdentity(before), "Routing changed placement or declared electrical constraints")
console.log("All component placements and declared trace/decoupling constraints match the unrouted input.")
console.log("This identity check does not replace the Core DRC, trace-length/via, or Gerber shorts gates.")
