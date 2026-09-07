import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const files = process.argv.slice(2)
const unroutedBaseline = files[0] === "--unrouted-baseline"
if (unroutedBaseline) files.shift()
assert(files.length >= 2, "Expected a baseline and candidate reports")
const reports = files.map(file => JSON.parse(readFileSync(file, "utf8")))
const baseline = reports[0]
for (const [index, report] of reports.entries()) {
  assert.deepEqual(report.componentNames, baseline.componentNames, "A component was added/removed")
  assert.deepEqual(report.parts, baseline.parts, "A component's electrical part changed")
  assert.equal(report.netlistSha256, baseline.netlistSha256, "Electrical connections changed")
  assert.deepEqual(report.protectedPlacements, baseline.protectedPlacements, "A protected button, MCU, crystal or connector moved")
  assert.deepEqual(report.bottomComponents, [], "Components must be top-side")
  if (unroutedBaseline && index === 0) {
    assert.equal(report.pcbTraces, 0, "Expected an unrouted preflight baseline")
    assert.equal(report.pcbVias, 0, "Preflight must not contain authored vias")
  } else {
    assert(report.pcbTraces > 0, "Missing routed PCB")
  }
}
console.table(reports.map(r => ({ file: r.file, components: r.componentCount, traces: r.pcbTraces, vias: r.pcbVias, pours: r.copperRegions, errors: r.errorCount, criticalWarnings: r.criticalWarningCount })))
console.log("Same components, electrical nets and protected placements in every variant.")
