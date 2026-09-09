import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"

type Element = Record<string, unknown>

const input = process.argv[2] ?? "dist/index/circuit.json"
const output = process.argv[3] ?? "artifacts/drc-report.json"
const elements = JSON.parse(readFileSync(input, "utf8")) as Element[]
const byId = new Map<string, Element>()
for (const element of elements) {
  for (const [key, value] of Object.entries(element)) {
    if (key.endsWith("_id") && typeof value === "string") byId.set(value, element)
  }
}

const componentNameByPcbId = new Map<string, string>()
for (const component of elements.filter((e) => e.type === "pcb_component")) {
  const pcbId = component.pcb_component_id
  const sourceId = component.source_component_id
  const source = typeof sourceId === "string" ? byId.get(sourceId) : undefined
  if (typeof pcbId === "string") {
    componentNameByPcbId.set(pcbId, String(source?.name ?? pcbId))
  }
}

function collectIds(value: unknown, ids = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) collectIds(item, ids)
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value as Element)) {
      if (key.endsWith("_id") && typeof item === "string") ids.add(item)
      collectIds(item, ids)
    }
  }
  return ids
}

function findCoordinate(value: unknown): { x?: number; y?: number } {
  if (!value || typeof value !== "object") return {}
  const record = value as Element
  if (typeof record.pcb_x === "number" && typeof record.pcb_y === "number") {
    return { x: record.pcb_x, y: record.pcb_y }
  }
  for (const child of Object.values(record)) {
    const point = findCoordinate(child)
    if (point.x !== undefined) return point
  }
  return {}
}

function describe(id: string) {
  if (componentNameByPcbId.has(id)) return componentNameByPcbId.get(id)!
  const element = byId.get(id)
  if (!element) return id
  return String(
    element.name ??
      element.source_trace_id ??
      element.pcb_trace_id ??
      element.source_port_id ??
      id,
  )
}

const errors = elements.filter((element) =>
  typeof element.type === "string" && element.type.endsWith("_error"),
)
const records = errors.map((error) => {
  const related = [...collectIds(error)].filter((id) => id !== error.pcb_error_id)
  const point = findCoordinate(error)
  const relatedElements = related.map(describe).sort()
  const signature = [
    error.type,
    relatedElements.join(","),
    point.x?.toFixed(2) ?? "",
    point.y?.toFixed(2) ?? "",
  ].join("|")
  return {
    type: error.type,
    message: error.message ?? null,
    locationMm: point.x === undefined ? null : point,
    relatedElements,
    signature,
  }
})

const byType = Object.groupBy(records, (record) => String(record.type))
const report = {
  input,
  errorCount: records.length,
  byType: Object.fromEntries(
    Object.entries(byType).map(([type, group]) => [type, group?.length ?? 0]),
  ),
  errors: records,
  attribution: {
    note: "A record identifies the DRC type, location when emitted, and related PCB/source elements. To determine whether it was introduced by a change, compare these stable signatures against an equivalent baseline routing run using the same router version and board input.",
  },
}

mkdirSync(dirname(output), { recursive: true })
writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report, null, 2))
