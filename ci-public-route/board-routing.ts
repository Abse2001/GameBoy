// Routing-only edits to the verified public abse/gameboy-advance 0.0.12 source.
// Component placement, electrical connections, widths and DRC limits stay intact.
export const manualTraceNames = ["XIN", "XOUT", "T_C_XIN", "T_C_XOUT"]

const routingPhases = [
  { name: "clock", traces: ["XIN", "XOUT_DAMPING", "XOUT", "T_C_XIN", "T_C_XOUT"] },
  { name: "switching-power", traces: ["BAT_BUCKBOOST_L1", "BAT_BUCKBOOST_L2", "BUCK_SWITCH", "BUCK_BOOTSTRAP_BST"] },
  { name: "local-decoupling", traces: ["C_VREG_AVDD_P", "C_DVDD3_SUPPLY", "C_DVDD2_BULK_SUPPLY", "C_IOVDD1_SUPPLY", "SD_DECOUPLING", "BAT_OUTPUT_CAP_LOCAL", "BAT_INPUT_CAP_LOCAL"] },
]

export function applyRoutingPlan(source: string): string {
  let result = source
  for (const [phaseIndex, phase] of routingPhases.entries()) {
    for (const name of phase.traces) {
      const marker = `<trace name="${name}"`
      if (result.split(marker).length !== 2) throw new Error(`Expected exactly one ${name} trace`)
      // An empty pcbPath explicitly joins the two selected pads. These four
      // crystal paths were checked against the placed pad geometry; no vias.
      const manual = manualTraceNames.includes(name) ? " pcbPath={[]}" : ""
      result = result.replace(marker, `${marker} routingPhaseIndex={${phaseIndex}}${manual}`)
    }
  }
  const marker = "    <bus"
  if (!result.includes(marker)) throw new Error("Missing original bus section")
  const phases = routingPhases.map((phase, index) =>
    `    <autoroutingphase phaseIndex={${index}} name="${phase.name}" />`,
  ).join("\n")
  result = result.replace(marker, `${phases}\n\n${marker}`)
  const restored = result.replace(`${phases}\n\n`, "")
    .replace(/ routingPhaseIndex=\{[012]\}/g, "")
    .replace(/ pcbPath=\{\[\]\}/g, "")
  if (restored !== source) throw new Error("Routing plan changed something beyond phases and manual paths")
  return result
}
