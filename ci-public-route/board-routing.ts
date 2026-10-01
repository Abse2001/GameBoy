// Routing-only edits to the verified public abse/gameboy-advance 0.0.12 source.
// Component placement, electrical connections, widths and DRC limits stay intact.
const manualPaths: Record<string, string> = {
  XIN: '[".U1 > .XIN"]',
  XOUT: '[".U_XTAL > .pin3"]',
  T_C_XIN: '[".U_XTAL > .pin1"]',
  T_C_XOUT: '[".U_XTAL > .pin3"]',
  // U1's footprint frame is rotated 180 degrees about (0.2, 15.15).
  // This waypoint is board (0.49, 19.35), clearing the adjacent DVDD2 pad.
  // The two-segment route is 4.969193631 mm, below the unchanged 5 mm limit.
  XOUT_DAMPING: "[{ x: -0.29, y: -4.2 }]",
}
export const manualTraceNames = Object.keys(manualPaths)

const routingPhases = [
  { name: "clock", traces: ["XIN", "XOUT_DAMPING", "XOUT", "T_C_XIN", "T_C_XOUT"] },
  { name: "switching-power", traces: ["BAT_BUCKBOOST_L1", "BAT_BUCKBOOST_L2", "BUCK_SWITCH", "BUCK_BOOTSTRAP_BST"] },
  { name: "local-decoupling", traces: ["C_VREG_AVDD_P", "C_DVDD3_SUPPLY", "C_DVDD2_BULK_SUPPLY", "C_IOVDD1_SUPPLY", "SD_DECOUPLING", "BAT_OUTPUT_CAP_LOCAL", "BAT_INPUT_CAP_LOCAL"] },
]

export function applyRoutingPlan(source: string): string {
  let result = source
  const replacements: Array<[string, string]> = []
  for (const [phaseIndex, phase] of routingPhases.entries()) {
    for (const name of phase.traces) {
      const marker = `<trace name="${name}"`
      if (result.split(marker).length !== 2) throw new Error(`Expected exactly one ${name} trace`)
      // Use explicit nonempty paths: this release recognizes only those as
      // fixed manual copper. Empty arrays are editable by later repair phases.
      const manual = manualPaths[name] ? ` pcbPath={${manualPaths[name]}}` : ""
      const replacement = `${marker} routingPhaseIndex={${phaseIndex}}${manual}`
      result = result.replace(marker, replacement)
      replacements.push([replacement, marker])
    }
  }
  const marker = "    <bus"
  if (!result.includes(marker)) throw new Error("Missing original bus section")
  const phases = routingPhases.map((phase, index) =>
    `    <autoroutingphase phaseIndex={${index}} name="${phase.name}" />`,
  ).join("\n")
  result = result.replace(marker, `${phases}\n\n${marker}`)
  let restored = result.replace(`${phases}\n\n`, "")
  for (const [replacement, marker] of replacements) restored = restored.replace(replacement, marker)
  if (restored !== source) throw new Error("Routing plan changed something beyond phases and manual paths")
  return result
}
