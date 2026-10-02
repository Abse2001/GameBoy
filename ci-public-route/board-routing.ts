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
    // pcbPath uses the declared pre-layout frame (-32, -31), not the
    // footprint bounding-box center rounded during layout. Keep exact checks.
    waypoints: [{ x: -32 + 0.00012699999999554734, y: -31.5 }, { x: -32 + 0.7499349999999972, y: -31.5 }],
  },
  // Explicitly connect every BAT_PROTECTED terminal, not just the VIN caps.
  // This keeps an automatic net branch from re-entering the composite VIN pad
  // and being narrowed by the published power-trace expansion stage.
  BAT_INPUT_CAP_LOCAL: { jsx: '[".U_BAT_BUCKBOOST > .VIN"]', width: 0.4 },
  BAT_INPUT_CAP_A: { jsx: '[".U_BAT_BUCKBOOST > .VIN"]', width: 0.4 },
  BAT_INPUT_CAP_B: {
    // C_BAT_IN_BULK_B is rotated 90 degrees about (-36, -33.5).
    // Keep the vertical leg left of EN/VSEL, retaining its 5.5 mm limit.
    jsx: "[{ x: -0.05, y: -1.05 }, { x: 2.75, y: -1.05 }]", width: 0.4,
    waypoints: [{ x: -34.95, y: -33.55 }, { x: -34.95, y: -30.75 }],
  },
  BAT_MODE_INPUT: {
    jsx: "[{ x: -2.3, y: 1.9 }]", width: 0.1,
    waypoints: [{ x: -34.3, y: -29.1 }],
  },
  BAT_BUCKBOOST_INPUT: { jsx: '[".C_BAT_IN_LOCAL > .pin1"]', width: 0.4 },
  BATTERY_TO_SWITCH: {
    // Q_BAT_REVERSE's declared frame is (-39.8, -34), rotation zero.
    // Use the clear bottom perimeter corridor, passing left of switch holes.
    jsx: "[{ x: -0.2, y: 0.94996 }, { x: -0.2, y: -4.5 }, { x: 100.8, y: -4.5 }, { x: 102.3, y: -3 }, { x: 102.3, y: 7.175 }]",
    width: 0.3,
    waypoints: [
      { x: -40, y: -33.05004 },
      { x: -40, y: -38.5 },
      { x: 61, y: -38.5 },
      { x: 62.5, y: -37 },
      { x: 62.5, y: -26.825 },
    ],
  },
  // Keep the four short switching connections explicit as well. The complete
  // battery tree made automatic topology planning for this phase time out.
  // These paths retain each trace's authored width and pass static clearances.
  BAT_BUCKBOOST_L1: {
    jsx: "[{ x: -0.499999, y: 1.5 }, { x: -1.199896, y: 2.2 }]", width: 0.4,
    waypoints: [{ x: -32.499999, y: -29.5 }, { x: -33.199896, y: -28.8 }],
  },
  BAT_BUCKBOOST_L2: {
    jsx: "[{ x: 0.499999, y: 1.5 }, { x: 1.199896, y: 2.2 }]", width: 0.4,
    waypoints: [{ x: -31.500001, y: -29.5 }, { x: -30.800104, y: -28.8 }],
  },
  BUCK_SWITCH: {
    // U_3V3's declared frame is rotated 90 degrees about (-18, -12).
    jsx: "[{ x: 0, y: 3.55 }]", width: 0.6,
    waypoints: [{ x: -21.55, y: -12 }],
  },
  BUCK_BOOTSTRAP_BST: {
    // C_3V3_BST is rotated 180 degrees about (-18.9, -9.4).
    jsx: "[{ x: -0.9, y: 0 }, { x: -0.9, y: 3.54996 }]", width: 0.1,
    waypoints: [{ x: -18, y: -9.4 }, { x: -18, y: -12.94996 }],
  },
  // Replace the short DVDD1 branch's two automatic vias with direct copper.
  // C_DVDD1 is rotated 180 degrees about (-7.08, 14.3).
  C_DVDD1_SUPPLY: {
    jsx: "[{ x: -2.88, y: -0.450077 }]", width: 0.1,
    waypoints: [{ x: -4.2, y: 14.750077000000001 }],
  },
  // Keep reset below C_DVDD2's pads and above U1's top pad row. R_RUN is
  // rotated 180 degrees about (-5.51, 21.2); no via is needed on this branch.
  RUN_PULLUP: {
    jsx: "[{ x: -2.31, y: 1.45 }, { x: -4.50985, y: 1.45 }]", width: 0.1,
    waypoints: [{ x: -3.1999999999999997, y: 19.75 }, { x: -1.0001499999999997, y: 19.75 }],
  },
}

// Replace net-only branches with explicit same-net endpoints. The original
// BAT_REVERSE_SOURCE still attaches the whole tree to net.BAT_PROTECTED.
// The rendered electrical-group fingerprint must remain exactly unchanged.
const localConnections: Array<{ name: string; field: "from" | "to"; original: string; selector: string }> = [
  { name: "BAT_BUCKBOOST_INPUT", field: "from", original: "net.BAT_PROTECTED", selector: ".Q_BAT_REVERSE > .source" },
  { name: "BAT_BUCKBOOST_INPUT", field: "to", original: ".U_BAT_BUCKBOOST > .VIN", selector: ".C_BAT_IN_LOCAL > .pin1" },
  { name: "BATTERY_TO_SWITCH", field: "from", original: "net.BAT_PROTECTED", selector: ".Q_BAT_REVERSE > .source" },
]
export const manualTraceNames = Object.keys(manualPaths)

const routingPhases = [
  { name: "clock", traces: ["XIN", "XOUT_DAMPING", "XOUT", "T_C_XIN", "T_C_XOUT"] },
  { name: "switching-power", traces: ["BAT_BUCKBOOST_L1", "BAT_BUCKBOOST_L2", "BUCK_SWITCH", "BUCK_BOOTSTRAP_BST"] },
  { name: "local-decoupling", traces: ["C_VREG_AVDD_P", "C_DVDD3_SUPPLY", "C_DVDD2_BULK_SUPPLY", "C_IOVDD1_SUPPLY", "SD_DECOUPLING", "BAT_OUTPUT_CAP_LOCAL", "BAT_INPUT_CAP_LOCAL"] },
]

// Clock and switching-power are now fully covered by exact manual paths.
export const expectedAutomaticPhaseNames = ["local-decoupling", "remaining-connections"]

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
  for (const connection of localConnections) {
    const { name } = connection
    const marker = `<trace name="${name}"`
    if (result.split(marker).length !== 2) throw new Error(`Expected exactly one ${name} trace`)
    const start = result.indexOf(marker)
    const end = result.indexOf("/>", start)
    if (end === -1) throw new Error(`Missing end of ${name} trace`)
    const original = result.slice(start, end + 2)
    const destination = `${connection.field}="${connection.original}"`
    if (original.split(destination).length !== 2) throw new Error(`Unexpected original endpoint for ${name}`)
    const replacement = original.replace(destination, `${connection.field}="${connection.selector}"`)
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
  // Route with extra clearance; the board's original 0.13 mm acceptance
  // rule and all other constraints remain unchanged.
  const phases = [
    ...routingPhases.map((phase, index) =>
      `    <autoroutingphase phaseIndex={${index}} name="${phase.name}" minTraceToPadEdgeClearance="0.16mm" />`,
    ),
    '    <autoroutingphase name="remaining-connections" minTraceToPadEdgeClearance="0.16mm" />',
  ].join("\n")
  result = result.replace(marker, `${phases}\n\n${marker}`)
  let restored = result.replace(`${phases}\n\n`, "")
  for (const [replacement, marker] of replacements.reverse()) restored = restored.replace(replacement, marker)
  if (restored !== source) throw new Error("Routing plan changed something beyond phases, same-net local destinations and manual paths")
  return result
}
