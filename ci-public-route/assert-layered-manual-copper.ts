import type { AnyCircuitElement } from "circuit-json"
import type { ManualRoutePoint } from "./board-routing"

type PcbTrace = Extract<AnyCircuitElement, { type: "pcb_trace" }>
type PcbPort = Extract<AnyCircuitElement, { type: "pcb_port" }>
type PcbVia = Extract<AnyCircuitElement, { type: "pcb_via" }>
type CheckedPoint =
  | (Extract<ManualRoutePoint, { route_type: "wire" }> & { width: number })
  | Extract<ManualRoutePoint, { route_type: "via" }>

export function assertLayeredManualCopper(
  circuit: AnyCircuitElement[],
  trace: PcbTrace,
  endpoints: PcbPort[],
  width: number,
  interior: ManualRoutePoint[],
): void {
  if (endpoints.length !== 2) throw new Error("Layered manual path requires two endpoints")
  const expected: CheckedPoint[] = [
    { route_type: "wire", x: endpoints[0].x, y: endpoints[0].y, layer: "top", width },
    ...interior.map((point): CheckedPoint => point.route_type === "wire" ? { ...point, width } : point),
    { route_type: "wire", x: endpoints[1].x, y: endpoints[1].y, layer: "top", width },
  ]
  if (trace.route.length !== expected.length) throw new Error("Layered manual point count changed")
  for (const [index, target] of expected.entries()) {
    const actual = trace.route[index]
    if (actual.route_type !== target.route_type || actual.x !== target.x || actual.y !== target.y) {
      throw new Error(`Layered manual point ${index} changed`)
    }
    if (actual.route_type === "wire") {
      if (target.route_type !== "wire" || actual.layer !== target.layer || actual.width !== width) {
        throw new Error(`Layered manual wire ${index} changed`)
      }
    } else if (actual.route_type === "via") {
      if (target.route_type !== "via" || actual.from_layer !== target.from_layer || actual.to_layer !== target.to_layer) {
        throw new Error(`Layered manual drill span ${index} changed`)
      }
    } else {
      throw new Error(`Unexpected layered manual point type at ${index}`)
    }
  }
  const expectedVias = interior.filter((point): point is Extract<ManualRoutePoint, { route_type: "via" }> => point.route_type === "via")
  const vias = circuit.filter((element): element is PcbVia => element.type === "pcb_via" && element.pcb_trace_id === trace.pcb_trace_id)
  if (vias.length !== expectedVias.length) throw new Error("Layered manual via count changed")
  for (const target of expectedVias) {
    const matches = vias.filter((via): boolean => via.x === target.x && via.y === target.y && via.from_layer === target.from_layer && via.to_layer === target.to_layer)
    if (matches.length !== 1) throw new Error("Missing or duplicated layered manual via")
    const via = matches[0]
    if (via.outer_diameter !== 0.45 || via.hole_diameter !== 0.15 || JSON.stringify([...via.layers].sort()) !== JSON.stringify(["inner1", "top"])) {
      throw new Error("Layered manual via dimensions or physical span changed")
    }
  }
}
