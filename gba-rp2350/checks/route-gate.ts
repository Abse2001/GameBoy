import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const report = JSON.parse(readFileSync(process.argv[2], "utf8"))
assert.equal(report.bottomComponents.length, 0, "Components must be top-side")
assert(report.pcbTraces > 0, "No routed copper")
assert.equal(report.errorCount, 0, "Routing/DRC errors remain; not ready")
assert.equal(report.criticalWarningCount, 0, "Missing connections or trace-length warnings remain")
