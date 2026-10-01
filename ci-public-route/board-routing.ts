// Routing-only edits to the verified public abse/gameboy-advance 0.0.12 source.
// Component placement, electrical connections, widths and DRC limits stay intact.
export const manualPaths: Record<string, {
  jsx: string
  width: number
  waypoints?: Array<{ x: number; y: number }>
}> = {
  XIN: { jsx: '[".U1 > .XIN"]', width: 0.1 },
  XOUT: { jsx: '[".U_XTAL > .pin3"]', width: 0.1 },
  T_C_XIN: { jsx: '[".U_XTAL > .pin1"]', width: 0.1 },
  T_C_XOUT: { jsx: '[".U_XTAL > .pin3"]', width: 0.1 },
  // U1's footprint frame is rotated 180 degrees about (0.2, 15.15).
  // This waypoint is board (0.49, 19.35), clearing the adjacent DVDD2 pad.
  // The two-segment route is 4.969193631 mm, below the unchanged 5 mm limit.
  XOUT_DAMPING: {
    jsx: "[{ x: -0.29, y: -4.2 }]", width: 0.1,
    waypoints: [{ x: 0.4900000000000005, y: 19.35 }],
  },
  BAT_LOCAL_GROUND: {
    jsx: "[{ x: 0.00012699999999554734, y: -0.5 }, { x: 0.7499349999999972, y: -0.5 }]", width: 0.4,
    waypoints: [{ x: -31.999873, y: -31.5 }, { x: -31.250065, y: -31.5 }],
  },
  BAT_INPUT_CAP_LOCAL: { jsx: '[".U_BAT_BUCKBOOST > .VIN"]', width: 0.4 },
  BAT_OUTPUT_CAP_C: {
    jsx: "[{ x: -2.3000000000000007, y: 1.7999999999999972 }, { x: -2.3000000000000007, y: 4.027549533333332 }]", width: 0.4,
    waypoints: [{ x: -29.7, y: -32.7 }, { x: -29.7, y: -30.47245046666667 }],
  },
  BAT_OUTPUT_CAP_LOCAL_GND: {
    jsx: "[{ x: 0.7000239999999991, y: -2.8000000000000007 }]", width: 0.4,
    waypoints: [{ x: -26, y: -30.299976 }],
  },
  SD_BULK_GND: {
    jsx: "[{ x: -0.3000000000000007, y: 2.1000000000000014 }, { x: -2.3201159999999987, y: 2.1000000000000014 }]", width: 0.1,
    waypoints: [{ x: 26.2, y: -22.3 }, { x: 26.2, y: -24.320116 }],
  },
}

// Replace net-only destinations with nearby pads already on that same net.
// This expresses the intended local decoupling connection without changing
// the electrical groups; the rendered netlist fingerprint is checked in CI.
const localConnections: Record<string, { net: string; to: string }> = {
  BAT_OUTPUT_CAP_LOCAL_GND: { net: "net.GND", to: ".C_BAT_OUT_BULK_B > .pin2" },
  SD_BULK_GND: { net: "net.GND", to: ".C_SD > .pin2" },
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
      const replacement = `${marker} routingPhaseIndex={${phaseIndex}}`
      result = result.replace(marker, replacement)
      replacements.push([replacement, marker])
    }
  }
  for (const [name, connection] of Object.entries(localConnections)) {
    const marker = `<trace name="${name}"`
    if (result.split(marker).length !== 2) throw new Error(`Expected exactly one ${name} trace`)
    const start = result.indexOf(marker)
    const end = result.indexOf("/>", start)
    if (end === -1) throw new Error(`Missing end of ${name} trace`)
    const original = result.slice(start, end + 2)
    const destination = `to="${connection.net}"`
    if (original.split(destination).length !== 2) throw new Error(`Unexpected original net for ${name}`)
    const replacement = original.replace(destination, `to="${connection.to}"`)
    result = result.replace(original, replacement)
    replacements.push([replacement, original])
  }
  for (const [name, path] of Object.entries(manualPaths)) {
    const marker = `<trace name="${name}"`
    if (result.split(marker).length !== 2) throw new Error(`Expected exactly one ${name} trace`)
    // This release recognizes only explicit nonempty paths as fixed copper.
    const replacement = `${marker} pcbPath={${path.jsx}}`
    result = result.replace(marker, replacement)
    replacements.push([replacement, marker])
  }
  const marker = "    <bus"
  if (!result.includes(marker)) throw new Error("Missing original bus section")
  const phases = routingPhases.map((phase, index) =>
    `    <autoroutingphase phaseIndex={${index}} name="${phase.name}" />`,
  ).join("\n")
  result = result.replace(marker, `${phases}\n\n${marker}`)
  let restored = result.replace(`${phases}\n\n`, "")
  for (const [replacement, marker] of replacements.reverse()) restored = restored.replace(replacement, marker)
  if (restored !== source) throw new Error("Routing plan changed something beyond phases, same-net local destinations and manual paths")
  return result
}
