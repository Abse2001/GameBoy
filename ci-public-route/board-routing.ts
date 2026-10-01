// Routing-only edits to the verified public abse/gameboy-advance 0.0.12 source.
// Component placement, electrical connections, widths and DRC limits stay intact.
export const manualPaths: Record<string, {
  jsx: string
  width: number
  waypoint?: { x: number; y: number }
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
    waypoint: { x: 0.4900000000000005, y: 19.35 },
  },
  BUCK_BOOTSTRAP_BST: {
    jsx: "[{ x: -0.5, y: 3.549999999999999 }]", width: 0.1,
    waypoint: { x: -18.4, y: -12.95 },
  },
  C_DVDD2_SUPPLY: {
    jsx: "[{ x: -1.5500000000000007, y: -2.25 }]", width: 0.1,
    waypoint: { x: 0.1499999999999999, y: 19.3 },
  },
  C_DVDD2_BULK_SUPPLY: {
    jsx: "[{ x: -1.25, y: 0.34999999999999787 }]", width: 0.1,
    waypoint: { x: -6.6, y: 20.6 },
  },
}

// Replace net-only destinations with nearby pads already on that same net.
// This expresses the intended local decoupling connection without changing
// the electrical groups; the rendered netlist fingerprint is checked in CI.
const localConnections: Record<string, { net: string; to: string; width: number }> = {
  C_IOVDD6_GND: { net: "net.GND", to: ".C_DVDD3 > .pin2", width: 0.1 },
  C_IOVDD5_GND: { net: "net.GND", to: ".C_DVDD3 > .pin2", width: 0.1 },
  C_IOVDD3_GND: { net: "net.GND", to: ".C_IOVDD2 > .pin2", width: 0.1 },
  C_DVDD2_BULK_GND: { net: "net.GND", to: ".C_IOVDD2 > .pin2", width: 0.1 },
  C_VREG_IN_P: { net: "net.V3V3", to: ".C_FLASH > .pin1", width: 0.1 },
  C_VREG_IN_G: { net: "net.GND", to: ".C_FLASH > .pin2", width: 0.1 },
  C_VREG_AVDD_G: { net: "net.GND", to: ".C_ADC > .pin2", width: 0.1 },
  C_QSPI_USB_P: { net: "net.V3V3", to: ".U1 > .IOVDD6", width: 0.1 },
  BAT_INPUT_CAP_LOCAL_GND: { net: "net.GND", to: ".C_BAT_IN_BULK_B > .pin2", width: 0.4 },
}
for (const [name, connection] of Object.entries(localConnections)) {
  manualPaths[name] = { jsx: JSON.stringify([connection.to]), width: connection.width }
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
