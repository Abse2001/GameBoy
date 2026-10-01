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
}

// Replace net-only destinations with nearby pads already on that same net.
// This expresses the intended local decoupling connection without changing
// the electrical groups; the rendered netlist fingerprint is checked in CI.
const localConnections: Record<string, { net: string; to: string }> = {}
export const manualTraceNames = Object.keys(manualPaths)

const routingPhases = [
  { name: "clock", traces: ["XIN", "XOUT_DAMPING", "XOUT", "T_C_XIN", "T_C_XOUT"] },
  { name: "switching-power", traces: ["BAT_BUCKBOOST_L1", "BAT_BUCKBOOST_L2", "BUCK_SWITCH", "BUCK_BOOTSTRAP_BST"] },
  { name: "local-decoupling", traces: ["C_VREG_AVDD_P", "C_DVDD3_SUPPLY", "C_DVDD2_BULK_SUPPLY", "C_IOVDD1_SUPPLY", "SD_DECOUPLING", "BAT_OUTPUT_CAP_LOCAL", "BAT_INPUT_CAP_LOCAL"] },
  { name: "memory-interface", traces: ["QSPI_SS", "QSPI_SD0", "QSPI_SD1", "QSPI_SD2", "QSPI_SD3", "QSPI_SCLK", "BOOT_PULLUP", "BOOTSEL_SERIES", "PSRAM_CE", "PSRAM_SIO0", "PSRAM_SIO1", "PSRAM_SIO2", "PSRAM_SIO3", "PSRAM_SCLK", "PSRAM_CE_PULLUP"] },
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
