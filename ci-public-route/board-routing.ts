// Routing-only edits to the verified public abse/gameboy-advance 0.0.12 source.
// Component placement, electrical connections, widths and DRC limits stay intact.
type ManualLayer = "top" | "inner1" | "inner2" | "bottom"
export type ManualRoutePoint =
  | { route_type: "wire"; x: number; y: number; layer: ManualLayer }
  | { route_type: "via"; x: number; y: number; from_layer: ManualLayer; to_layer: ManualLayer }

export const manualPaths: Record<string, {
  jsx: string
  width: number
  waypoints?: Array<{ x: number; y: number }>
  innerRoute?: ManualRoutePoint[]
}> = {
  // Keep this local return left of flash VCC instead of a wide automatic
  // ground detour. Retain its inherited 0.10 mm width and 5.5 mm limit.
  // C_QSPI_USB's declared frame is (4.1,10), rotated 180 degrees.
  C_QSPI_USB_G: {
    jsx: '[{"x":0.8000000000000003,"y":0},{"x":0.7999999999999998,"y":4}]',
    width: 0.1,
    waypoints: [{ x: 3.2999999999999994, y: 10 }, { x: 3.2999999999999994, y: 6 }],
  },
  // Bridge the two existing 3.3 V islands at the full 0.60 mm rail width.
  // C_IOVDD4's frame is (5.6, 20.25), rotated 90 degrees. Both drills stay
  // outside pads and include inner1 on the way to inner2; no fifth layer.
  IOVDD4_IOVDD5_BRIDGE: {
    jsx: '[{"x":-1.0500000000000007,"y":0},{"x":-1.0500000000000007,"y":0,"via":true,"fromLayer":"top","toLayer":"inner2"},{"x":-1.0500000000000007,"y":0},{"x":-1.0500000000000007,"y":-0.20000000000000018},{"x":-2.9499999999999993,"y":-0.20000000000000018},{"x":-2.9499999999999993,"y":-0.20000000000000018,"via":true,"fromLayer":"inner2","toLayer":"top"},{"x":-2.9499999999999993,"y":-0.20000000000000018}]',
    width: 0.6,
    innerRoute: [
      { route_type: "wire", x: 5.6, y: 19.2, layer: "top" },
      { route_type: "via", x: 5.6, y: 19.2, from_layer: "top", to_layer: "inner2" },
      { route_type: "wire", x: 5.6, y: 19.2, layer: "inner2" },
      { route_type: "wire", x: 5.8, y: 19.2, layer: "inner2" },
      { route_type: "wire", x: 5.8, y: 17.3, layer: "inner2" },
      { route_type: "via", x: 5.8, y: 17.3, from_layer: "inner2", to_layer: "top" },
      { route_type: "wire", x: 5.8, y: 17.3, layer: "top" },
    ],
  },
  // Join adjacent decoupling grounds around C_IOVDD4's supply pad. Its frame
  // is (5.6, 20.25), rotated 90 degrees; retain the original 5.5 mm limit.
  C_IOVDD4_GND: {
    jsx: '[{"x":0.42011600000000066,"y":-0.75},{"x":-3.5500000000000007,"y":-0.7500000000000002}]',
    width: 0.1,
    waypoints: [{ x: 6.35, y: 20.670116 }, { x: 6.35, y: 16.7 }],
  },
  // Enter touch SDA from the right of the LCD pad row, avoiding the existing
  // SCL/reset copper. R_TOUCH_SDA's frame is (29.7, 3.4), rotated 180 degrees.
  TOUCH_SDA_PULLUP: {
    jsx: '[{"x":-1.5,"y":-4.440892098500626e-16},{"x":-1.5,"y":0.6999999999999993},{"x":-5.0000000000000036,"y":0.6999999999999988},{"x":-5.0000000000000036,"y":-2.250006800000001}]',
    width: 0.1,
    waypoints: [
      { x: 31.2, y: 3.4000000000000004 },
      { x: 31.2, y: 2.7 },
      { x: 34.7, y: 2.7 },
      { x: 34.7, y: 5.6500068 },
    ],
  },
  // Escape C_CORE ground on inner1 without crossing the VREG_LX switch trace.
  // Both blind vias stay outside pads; the original 5.5 mm limit is retained.
  C_CORE_G: {
    jsx: '[{"x":0.42011599999999993,"y":0.6500000000000004},{"x":0.42011599999999993,"y":0.6500000000000004,"via":true,"fromLayer":"top","toLayer":"inner1"},{"x":0.42011599999999993,"y":0.6500000000000004},{"x":0.2000460000000004,"y":-2.4000000000000004},{"x":0.2000460000000004,"y":-2.4000000000000004,"via":true,"fromLayer":"inner1","toLayer":"top"},{"x":0.2000460000000004,"y":-2.4000000000000004}]',
    width: 0.1,
    innerRoute: [
      { route_type: "wire", x: -2.420116, y: 9.45, layer: "top" },
      { route_type: "via", x: -2.420116, y: 9.45, from_layer: "top", to_layer: "inner1" },
      { route_type: "wire", x: -2.420116, y: 9.45, layer: "inner1" },
      { route_type: "wire", x: -2.200046, y: 12.5, layer: "inner1" },
      { route_type: "via", x: -2.200046, y: 12.5, from_layer: "inner1", to_layer: "top" },
      { route_type: "wire", x: -2.200046, y: 12.5, layer: "top" },
    ],
  },
  // Keep the return outside the unrelated button bodies, then enter LCD
  // ground horizontally without crossing pin 10. Frame (45, 36), unrotated.
  R_SHOULDER_GND: {
    jsx: '[{"x":10.3,"y":-2.2499319999999994},{"x":10.3,"y":-13.3500272},{"x":-9.5,"y":-13.3500272}]',
    width: 0.1,
    waypoints: [
      { x: 55.3, y: 33.750068 },
      { x: 55.3, y: 22.6499728 },
      { x: 35.5, y: 22.6499728 },
    ],
  },
  // Join the MCU's two ground pads without crossing the neighboring VREG_LX
  // pad. Keep the authored branch width; the ground rail remains 0.80 mm.
  VREG_PGND: {
    jsx: '[{"x":2.4000459999999997,"y":2.6500000000000004}]',
    width: 0.1,
    waypoints: [{ x: -2.200046, y: 12.5 }],
  },
  // Feed the QSPI/USB supply island on bottom copper, retaining this
  // branch's original 0.10 mm width and the separate 0.60 mm main rail.
  USB_OTP_VDD: {
    jsx: '[{"x":-0.5000000000000002,"y":2.6500000000000004},{"x":-0.5000000000000002,"y":2.6500000000000004,"via":true,"fromLayer":"top","toLayer":"bottom"},{"x":-0.5000000000000002,"y":2.6500000000000004},{"x":-0.5000000000000002,"y":2.1500000000000004},{"x":-5.1,"y":2.1500000000000004},{"x":-5.1,"y":2.200000000000001},{"x":-5.1,"y":2.200000000000001,"via":true,"fromLayer":"bottom","toLayer":"top"},{"x":-5.1,"y":2.200000000000001},{"x":-5.1,"y":2.25},{"x":-4.3999999999999995,"y":2.25},{"x":-4.3999999999999995,"y":2.799969000000001}]',
    width: 0.1,
    innerRoute: [
      { route_type: "wire", x: 0.7, y: 12.5, layer: "top" },
      { route_type: "via", x: 0.7, y: 12.5, from_layer: "top", to_layer: "bottom" },
      { route_type: "wire", x: 0.7, y: 12.5, layer: "bottom" },
      { route_type: "wire", x: 0.7, y: 13, layer: "bottom" },
      { route_type: "wire", x: 5.3, y: 13, layer: "bottom" },
      { route_type: "wire", x: 5.3, y: 12.95, layer: "bottom" },
      { route_type: "via", x: 5.3, y: 12.95, from_layer: "bottom", to_layer: "top" },
      { route_type: "wire", x: 5.3, y: 12.95, layer: "top" },
      { route_type: "wire", x: 5.3, y: 12.9, layer: "top" },
      { route_type: "wire", x: 4.6, y: 12.9, layer: "top" },
      { route_type: "wire", x: 4.6, y: 12.350031, layer: "top" },
    ],
  },
  // Join the two adjacent I/O supply islands on inner1, below the DVDD trace.
  // Keep the 0.60 mm rail width and place both via holes outside the pads.
  IOVDD6_IOVDD5_BRIDGE: {
    jsx: '[{"x":-0.2999999999999998,"y":0.5999999999999996},{"x":-0.2999999999999998,"y":0.5999999999999996,"via":true,"fromLayer":"top","toLayer":"inner1"},{"x":-0.2999999999999998,"y":0.5999999999999996},{"x":-0.2999999999999998,"y":3.200000000000001},{"x":-0.2999999999999998,"y":3.200000000000001,"via":true,"fromLayer":"inner1","toLayer":"top"},{"x":-0.2999999999999998,"y":3.200000000000001}]',
    width: 0.6,
    innerRoute: [
      { route_type: "wire", x: 5.8, y: 13.5, layer: "top" },
      { route_type: "via", x: 5.8, y: 13.5, from_layer: "top", to_layer: "inner1" },
      { route_type: "wire", x: 5.8, y: 13.5, layer: "inner1" },
      { route_type: "wire", x: 5.8, y: 16.1, layer: "inner1" },
      { route_type: "via", x: 5.8, y: 16.1, from_layer: "inner1", to_layer: "top" },
      { route_type: "wire", x: 5.8, y: 16.1, layer: "top" },
    ],
  },
  // Short, direct branches keep their authored endpoints and widths. Route
  // these without vias before solving the remaining multi-terminal nets.
  BAT_REVERSE_GATE: { jsx: '[".R_BAT_REVERSE_GATE > .pin1"]', width: 0.1 },
  BAT_VAUX_CAP: { jsx: '[".U_BAT_BUCKBOOST > .VAUX"]', width: 0.1 },
  USB_VALID_DECOUPLING: { jsx: '[".U_USB_VALID > .VDD"]', width: 0.1 },
  SD_CMD_PULLUP: { jsx: '[".J_SD > .CMD"]', width: 0.1 },
  SD_DAT0_PULLUP: { jsx: '[".J_SD > .DAT0"]', width: 0.1 },
  SD_DAT2_PULLUP: { jsx: '[".J_SD > .DAT2"]', width: 0.1 },
  BUCK_INPUT_CAP: { jsx: '[".U_3V3 > .VIN"]', width: 0.6 },
  USB_VALID_TO_BASE_RESISTOR: { jsx: '[".R_USB_BOOST_OFF > .pin1"]', width: 0.1 },
  USB_VALID_BASE_PULLDOWN: { jsx: '[".R_USB_BOOST_OFF_PULLDOWN > .pin1"]', width: 0.1 },
  BAT_OUTPUT_CAP_A: { jsx: '[".U_BAT_BUCKBOOST > .VOUT"]', width: 0.4 },
  // Join the nearby decoupling grounds before routing the remaining ground net.
  // Keep the branch's inherited 0.10 mm width and original 5.5 mm length limit.
  C_IOVDD6_GND: { jsx: '[".C_DVDD3 > .pin2"]', width: 0.1 },
  // J_LCD's declared frame is (34.951428, 15.4), rotated 90 degrees.
  // Route SCL on bottom around existing memory copper, with its pull-up
  // on inner2 from R_TOUCH_SCL's unrotated frame (29.7, 5.2).
  TOUCH_SCL: {
    jsx: '[{"x":-9.5,"y":2.8514279999999985},{"x":-9.5,"y":2.8514279999999985,"via":true,"fromLayer":"top","toLayer":"bottom"},{"x":-9.5,"y":2.8514279999999985},{"x":-0.9000000000000004,"y":2.8514279999999985},{"x":-0.9000000000000021,"y":30.051428},{"x":-1.9500000000000028,"y":30.051428},{"x":-1.9500000000000028,"y":30.051428,"via":true,"fromLayer":"bottom","toLayer":"top"},{"x":-1.9500000000000028,"y":30.051428}]',
    width: 0.1,
    innerRoute: [
      {"route_type":"wire","x":32.1,"y":5.9,"layer":"top"},
      {"route_type":"via","x":32.1,"y":5.9,"from_layer":"top","to_layer":"bottom"},
      {"route_type":"wire","x":32.1,"y":5.9,"layer":"bottom"},
      {"route_type":"wire","x":32.1,"y":14.5,"layer":"bottom"},
      {"route_type":"wire","x":4.899999999999999,"y":14.5,"layer":"bottom"},
      {"route_type":"wire","x":4.899999999999999,"y":13.45,"layer":"bottom"},
      {"route_type":"via","x":4.899999999999999,"y":13.45,"from_layer":"bottom","to_layer":"top"},
      {"route_type":"wire","x":4.899999999999999,"y":13.45,"layer":"top"},
    ],
  },
  TOUCH_SCL_PULLUP: {
    jsx: '[{"x":-1.6999999999999993,"y":0},{"x":-1.6999999999999993,"y":0,"via":true,"fromLayer":"top","toLayer":"inner2"},{"x":-1.6999999999999993,"y":0},{"x":-1.6999999999999993,"y":1.2999999999999998},{"x":2.1000000000000014,"y":1.2999999999999998},{"x":2.1000000000000014,"y":1.2999999999999998,"via":true,"fromLayer":"inner2","toLayer":"top"},{"x":2.1000000000000014,"y":1.2999999999999998},{"x":2.400000000000002,"y":0.9500058000000005}]',
    width: 0.1,
    innerRoute: [
      {"route_type":"wire","x":28,"y":5.2,"layer":"top"},
      {"route_type":"via","x":28,"y":5.2,"from_layer":"top","to_layer":"inner2"},
      {"route_type":"wire","x":28,"y":5.2,"layer":"inner2"},
      {"route_type":"wire","x":28,"y":6.5,"layer":"inner2"},
      {"route_type":"wire","x":31.8,"y":6.5,"layer":"inner2"},
      {"route_type":"via","x":31.8,"y":6.5,"from_layer":"inner2","to_layer":"top"},
      {"route_type":"wire","x":31.8,"y":6.5,"layer":"top"},
      {"route_type":"wire","x":32.1,"y":6.150005800000001,"layer":"top"},
    ],
  },
  // Join the shared LCD/touch reset net explicitly. The connector frame is
  // (34.951428, 15.4), rotated 90 degrees. Preserve exact native coordinates;
  // the MCU trunk uses bottom copper, and the connector branch uses inner1.
  LCD_RESET: {
    jsx: '[{"x":7.749971800000004,"y":2.8514279999999985},{"x":7.749971800000004,"y":2.8514279999999985,"via":true,"fromLayer":"top","toLayer":"bottom"},{"x":7.749971800000004,"y":2.8514279999999985},{"x":7.749971800000001,"y":39.451428},{"x":1.7503769999999967,"y":39.451428},{"x":1.7503769999999967,"y":39.451428,"via":true,"fromLayer":"bottom","toLayer":"top"},{"x":1.7503769999999967,"y":39.451428}]',
    width: 0.1,
    innerRoute: [
      {"route_type":"wire","x":32.1,"y":23.149971800000003,"layer":"top"},
      {"route_type":"via","x":32.1,"y":23.149971800000003,"from_layer":"top","to_layer":"bottom"},
      {"route_type":"wire","x":32.1,"y":23.149971800000003,"layer":"bottom"},
      {"route_type":"wire","x":-4.5,"y":23.149971800000003,"layer":"bottom"},
      {"route_type":"wire","x":-4.5,"y":17.150377,"layer":"bottom"},
      {"route_type":"via","x":-4.5,"y":17.150377,"from_layer":"bottom","to_layer":"top"},
      {"route_type":"wire","x":-4.5,"y":17.150377,"layer":"top"},
    ],
  },
  TOUCH_RESET: {
    jsx: '[{"x":-10.7499912,"y":3.6514279999999992},{"x":-10.7499912,"y":3.6514279999999992,"via":true,"fromLayer":"top","toLayer":"inner1"},{"x":-10.7499912,"y":3.6514279999999992},{"x":7.749971800000004,"y":3.6514279999999992},{"x":7.749971800000004,"y":3.6514279999999992,"via":true,"fromLayer":"inner1","toLayer":"top"},{"x":7.749971800000004,"y":3.6514279999999992}]',
    width: 0.1,
    innerRoute: [
      {"route_type":"wire","x":31.3,"y":4.6500088,"layer":"top"},
      {"route_type":"via","x":31.3,"y":4.6500088,"from_layer":"top","to_layer":"inner1"},
      {"route_type":"wire","x":31.3,"y":4.6500088,"layer":"inner1"},
      {"route_type":"wire","x":31.3,"y":23.149971800000003,"layer":"inner1"},
      {"route_type":"via","x":31.3,"y":23.149971800000003,"from_layer":"inner1","to_layer":"top"},
      {"route_type":"wire","x":31.3,"y":23.149971800000003,"layer":"top"},
    ],
  },
  XIN: { jsx: '[".U1 > .XIN"]', width: 0.1 },
  XOUT: { jsx: '[".U_XTAL > .pin3"]', width: 0.1 },
  T_C_XIN: { jsx: '[".U_XTAL > .pin1"]', width: 0.1 },
  T_C_XOUT: { jsx: '[".U_XTAL > .pin3"]', width: 0.1 },
  // Join adjacent pads already on V3V3 before routing the full rail. Keep
  // these branches' original 0.10 mm width; the main rail remains 0.60 mm.
  QSPI_IOVDD: { jsx: '[".U1 > .USB_OTP_VDD"]', width: 0.1 },
  ADC_AVDD: { jsx: '[".U1 > .IOVDD1"]', width: 0.1 },
  LCD_MODE_IM0: { jsx: '[".J_LCD > .pin8"]', width: 0.1 },
  LCD_MODE_IM1: { jsx: '[".J_LCD > .pin9"]', width: 0.1 },
  LCD_VDDI_40: { jsx: '[".J_LCD > .pin41"]', width: 0.1 },
  LCD_VDDI_41: { jsx: '[".J_LCD > .pin42"]', width: 0.1 },
  // Short same-net supply branches join nearby islands without new vias.
  // Keep the existing rail anchors and each branch's inherited 0.10 mm width.
  TOUCH_SDA_PULLUP_V3V3: { jsx: '[".R_TOUCH_IRQ > .pin2"]', width: 0.1 },
  TOUCH_SCL_PULLUP_V3V3: { jsx: '[".C_LCD_VCI > .pin1"]', width: 0.1 },
  C_ADC_P: { jsx: '[".U1 > .IOVDD1"]', width: 0.1 },
  SD_CMD_PULLUP_V3V3: { jsx: '[".C_SD_BULK > .pin1"]', width: 0.1 },
  BOOT_PULLUP_3V3: { jsx: '[".C_FLASH > .pin1"]', width: 0.1 },
  SD_DAT0_PULLUP_V3V3: { jsx: '[".C_SD > .pin1"]', width: 0.1 },
  SD_CS_PULLUP_V3V3: { jsx: '[".R_SD_DAT2 > .pin2"]', width: 0.1 },
  C_QSPI_USB_P: { jsx: '[".U1 > .IOVDD6"]', width: 0.1 },
  FLASH_VCC: { jsx: '[".C_QSPI_USB > .pin1"]', width: 0.1 },
  C_VREG_IN_P: { jsx: '[".C_FLASH > .pin1"]', width: 0.1 },
  SD_DAT1_PULLUP_V3V3: { jsx: '[".R_SD_DAT2 > .pin2"]', width: 0.1 },
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
  // Join the complete flash chip-select tree at U2.CS. The MCU branch uses
  // bottom copper, and the boot-switch branch uses inner2. Preserve exact
  // inverse-rotated coordinates so the long native segments stay axis-aligned.
  QSPI_SS: {
    jsx: '[{"x":-2.85,"y":4.4},{"x":-2.85,"y":4.4,"via":true,"fromLayer":"top","toLayer":"bottom"},{"x":-2.85,"y":4.4},{"x":-2.85,"y":3.9500000000000006},{"x":-0.8000000000000005,"y":3.950000000000001},{"x":-0.8000000000000015,"y":12.15},{"x":-4.049938000000002,"y":12.15},{"x":-4.049938000000002,"y":12.15,"via":true,"fromLayer":"bottom","toLayer":"top"},{"x":-4.049938000000002,"y":12.15}]',
    width: 0.1,
    innerRoute: [
      { route_type: "wire", x: 3.05, y: 10.75, layer: "top" },
      { route_type: "via", x: 3.05, y: 10.75, from_layer: "top", to_layer: "bottom" },
      { route_type: "wire", x: 3.05, y: 10.75, layer: "bottom" },
      { route_type: "wire", x: 3.05, y: 11.2, layer: "bottom" },
      { route_type: "wire", x: 1, y: 11.2, layer: "bottom" },
      { route_type: "wire", x: 1, y: 3, layer: "bottom" },
      { route_type: "wire", x: 4.249938, y: 3, layer: "bottom" },
      { route_type: "via", x: 4.249938, y: 3, from_layer: "bottom", to_layer: "top" },
      { route_type: "wire", x: 4.249938, y: 3, layer: "top" },
    ],
  },
  BOOT_PULLUP: {
    jsx: '[{"x":-2.249938,"y":-2.755379369979998e-16}]', width: 0.1,
    waypoints: [{ x: 4.249938, y: 4.4 }],
  },
  BOOTSEL_SERIES: {
    jsx: '[{"x":0.4328000000000004,"y":-0.6999999999999993},{"x":0.4328000000000004,"y":-0.6999999999999993,"via":true,"fromLayer":"top","toLayer":"inner2"},{"x":0.4328000000000004,"y":-0.6999999999999993},{"x":0.4327999999999997,"y":4.8},{"x":3.9999999999999996,"y":4.800000000000001},{"x":3.9999999999999996,"y":4.800000000000001,"via":true,"fromLayer":"inner2","toLayer":"top"},{"x":3.9999999999999996,"y":4.800000000000001},{"x":3.2500619999999993,"y":4.8}]',
    width: 0.1,
    innerRoute: [
      { route_type: "wire", x: 7.0672, y: 9.7, layer: "top" },
      { route_type: "via", x: 7.0672, y: 9.7, from_layer: "top", to_layer: "inner2" },
      { route_type: "wire", x: 7.0672, y: 9.7, layer: "inner2" },
      { route_type: "wire", x: 7.0672, y: 4.2, layer: "inner2" },
      { route_type: "wire", x: 3.5, y: 4.2, layer: "inner2" },
      { route_type: "via", x: 3.5, y: 4.2, from_layer: "inner2", to_layer: "top" },
      { route_type: "wire", x: 3.5, y: 4.2, layer: "top" },
      { route_type: "wire", x: 4.249938, y: 4.2, layer: "top" },
    ],
  },
  // Connect the complete SD2 net explicitly. U1's frame is (0.2,15.15),
  // rotated 180 degrees. Both vias sit outside the fine-pitch pad rows.
  // Internal elbows use inverse-transformed coordinates so the native
  // emitted segments remain exactly horizontal/vertical. Preserve these
  // coordinates: rounding a rotated-frame elbow fragments its obstacles.
  QSPI_SD2: {
    jsx: '[{ x: -1.999996, y: 4.4 }, { x: -1.999996, y: 4.4, via: true, fromLayer: "top", toLayer: "inner1" }, { x: -1.999996, y: 4.4 }, { x: -1.999996000000001, y: 11.55 }, { x: -5.049936, y: 11.55 }, { x: -5.049936, y: 11.55, via: true, fromLayer: "inner1", toLayer: "top" }, { x: -5.049936, y: 11.55 }]',
    width: 0.1,
    innerRoute: [
      { route_type: "wire", x: 2.1999959999999996, y: 10.75, layer: "top" },
      { route_type: "via", x: 2.1999959999999996, y: 10.75, from_layer: "top", to_layer: "inner1" },
      { route_type: "wire", x: 2.1999959999999996, y: 10.75, layer: "inner1" },
      { route_type: "wire", x: 2.1999959999999996, y: 3.5999999999999996, layer: "inner1" },
      { route_type: "wire", x: 5.249935999999998, y: 3.5999999999999996, layer: "inner1" },
      { route_type: "via", x: 5.249935999999998, y: 3.5999999999999996, from_layer: "inner1", to_layer: "top" },
      { route_type: "wire", x: 5.249935999999998, y: 3.5999999999999996, layer: "top" },
    ],
  },
  // Join the same SD2 net at flash pin3 instead of duplicating the MCU leg.
  // U_PSRAM's declared frame is (11.9,5.6), rotation zero.
  PSRAM_SIO2: {
    jsx: "[{ x: 0.249936, y: -2.45 }, { x: -6.650064, y: -2.45 }]", width: 0.1,
    waypoints: [{ x: 12.149936, y: 3.1499999999999995 }, { x: 5.249936, y: 3.1499999999999995 }],
  },
  // The complete SD3 net uses inner2, separate from SD2's inner1 segment.
  // Its top-to-inner2 drills still occupy inner1 and are checked on that layer.
  QSPI_SD3: {
    jsx: '[{ x: -0.799846, y: 4.4 }, { x: -0.799846, y: 4.4, via: true, fromLayer: "top", toLayer: "inner2" }, { x: -0.799846, y: 4.4 }, { x: -0.799846, y: 5.15 }, { x: -0.7998460000000002, y: 6.750000000000002 }, { x: -4.550064, y: 6.75 }, { x: -4.550064, y: 6.75, via: true, fromLayer: "inner2", toLayer: "top" }, { x: -4.550064, y: 6.75 }]',
    width: 0.1,
    innerRoute: [
      { route_type: "wire", x: 0.9998459999999993, y: 10.75, layer: "top" },
      { route_type: "via", x: 0.9998459999999993, y: 10.75, from_layer: "top", to_layer: "inner2" },
      { route_type: "wire", x: 0.9998459999999993, y: 10.75, layer: "inner2" },
      { route_type: "wire", x: 0.9998459999999993, y: 10, layer: "inner2" },
      { route_type: "wire", x: 0.9998459999999993, y: 8.399999999999999, layer: "inner2" },
      { route_type: "wire", x: 4.750063999999999, y: 8.399999999999999, layer: "inner2" },
      { route_type: "via", x: 4.750063999999999, y: 8.399999999999999, from_layer: "inner2", to_layer: "top" },
      { route_type: "wire", x: 4.750063999999999, y: 8.399999999999999, layer: "top" },
    ],
  },
  PSRAM_SIO3: {
    jsx: "[{ x: -0.249936, y: 2.6 }, { x: -7.149936, y: 2.6 }]", width: 0.1,
    waypoints: [{ x: 11.650064, y: 8.2 }, { x: 4.750064, y: 8.2 }],
  },
  // Keep the short regulator switch-node path outside both C_CORE pads.
  VREG_LX: {
    jsx: "[{ x: 1.999996, y: 4.4 }, { x: 3.399998, y: 4.4 }]", width: 0.1,
    waypoints: [{ x: -1.7999960000000006, y: 10.75 }, { x: -3.1999980000000003, y: 10.75 }],
  },
  // Escape between the SD2/SD3 vias, then use bottom copper for the clock.
  // SD3's inner2 shoulder above keeps clear of the clock's full-stack drill.
  QSPI_SCLK: {
    jsx: '[{ x: -1.199896, y: 4.2 }, { x: -1.4, y: 4.47 }, { x: -1.4, y: 4.47, via: true, fromLayer: "top", toLayer: "bottom" }, { x: -1.4, y: 4.47 }, { x: -1.4000000000000006, y: 8.45 }, { x: -5.049936, y: 8.45 }, { x: -5.049936, y: 8.45, via: true, fromLayer: "bottom", toLayer: "top" }, { x: -5.049936, y: 8.45 }]',
    width: 0.1,
    innerRoute: [
      { route_type: "wire", x: 1.3998959999999996, y: 10.95, layer: "top" },
      { route_type: "wire", x: 1.5999999999999994, y: 10.68, layer: "top" },
      { route_type: "via", x: 1.5999999999999994, y: 10.68, from_layer: "top", to_layer: "bottom" },
      { route_type: "wire", x: 1.5999999999999994, y: 10.68, layer: "bottom" },
      { route_type: "wire", x: 1.5999999999999994, y: 6.700000000000001, layer: "bottom" },
      { route_type: "wire", x: 5.249935999999999, y: 6.700000000000001, layer: "bottom" },
      { route_type: "via", x: 5.249935999999999, y: 6.700000000000001, from_layer: "bottom", to_layer: "top" },
      { route_type: "wire", x: 5.249935999999999, y: 6.700000000000001, layer: "top" },
    ],
  },
  PSRAM_SCLK: {
    jsx: "[{ x: 0.249936, y: 0.9 }, { x: -6.650064, y: 0.9 }]", width: 0.1,
    waypoints: [{ x: 12.149936, y: 6.5 }, { x: 5.249936, y: 6.5 }],
  },
  // Preserve the authored 0.40 mm output-capacitor path explicitly, avoiding
  // automatic power-trace expansion at the composite VOUT pad.
  BAT_OUTPUT_CAP_LOCAL: {
    jsx: "[{ x: 0.5, y: 1.2 }]", width: 0.4,
    waypoints: [{ x: -30, y: -30.5 }],
  },
  // Fix the five short MCU power branches explicitly. The published worker
  // stalled while planning their shared power-branches phase. These native
  // coordinates retain the original endpoints, 0.10 mm width and 5.5 mm limit.
  C_IOVDD2_SUPPLY: {
    jsx: "[{ x: -2.885, y: 0 }, { x: -2.885, y: 1.099618999999998 }]", width: 0.1,
    waypoints: [{ x: -4.2, y: 16.25 }, { x: -4.2, y: 15.150381000000001 }],
  },
  C_IOVDD3_SUPPLY: {
    jsx: "[{ x: -3.0849040000000003, y: 0 }]", width: 0.1,
    waypoints: [{ x: -2.6000959999999993, y: 19.4 }],
  },
  C_IOVDD4_SUPPLY: {
    jsx: "[{ x: -0.420116, y: 4.200103999999999 }]", width: 0.1,
    waypoints: [{ x: 1.399896000000001, y: 19.829884 }],
  },
  C_IOVDD5_SUPPLY: {
    jsx: "[{ x: -1.6, y: 0 }, { x: -1.6, y: -0.349977 }]", width: 0.1,
    waypoints: [{ x: 4.6, y: 16.7 }, { x: 4.6, y: 16.350023 }],
  },
  C_IOVDD6_SUPPLY: {
    jsx: "[{ x: -1.5, y: 0 }, { x: -1.5, y: -0.549969 }]", width: 0.1,
    waypoints: [{ x: 4.6, y: 12.9 }, { x: 4.6, y: 12.350031 }],
  },
  // Complete the remaining short power branches explicitly. PSRAM uses
  // inner2 to cross the existing signal escapes; its drills include inner1.
  // Core counts via travel in length, so its unchanged 5.5 mm limits remain
  // reported as deferred length violations, not hidden or increased.
  PSRAM_DECOUPLING: {
    jsx: '[{"x":-0.42011600000000016,"y":0.75},{"x":-0.42011600000000016,"y":0.75,"via":true,"fromLayer":"top","toLayer":"inner2"},{"x":-0.42011600000000016,"y":0.75},{"x":0.05000000000000071,"y":0.75},{"x":0.05000000000000071,"y":-1.7499999999999991},{"x":0.05000000000000071,"y":-1.7499999999999991,"via":true,"fromLayer":"inner2","toLayer":"top"},{"x":0.05000000000000071,"y":-1.7499999999999991},{"x":0.9499380000000013,"y":-1.7499999999999991}]',
    width: 0.1,
    innerRoute: [
      { route_type: "wire", x: 9.779884, y: 9.45, layer: "top" },
      { route_type: "via", x: 9.779884, y: 9.45, from_layer: "top", to_layer: "inner2" },
      { route_type: "wire", x: 9.779884, y: 9.45, layer: "inner2" },
      { route_type: "wire", x: 10.25, y: 9.45, layer: "inner2" },
      { route_type: "wire", x: 10.25, y: 6.95, layer: "inner2" },
      { route_type: "via", x: 10.25, y: 6.95, from_layer: "inner2", to_layer: "top" },
      { route_type: "wire", x: 10.25, y: 6.95, layer: "top" },
      { route_type: "wire", x: 11.149938, y: 6.95, layer: "top" },
    ],
  },
  PSRAM_BULK: {
    jsx: '[{"x":-0.4200999999999997,"y":-0.9499999999999993},{"x":-0.4200999999999997,"y":-0.9499999999999993,"via":true,"fromLayer":"top","toLayer":"inner2"},{"x":-0.4200999999999997,"y":-0.9499999999999993},{"x":-0.4200999999999997,"y":1.9000000000000004},{"x":-1.7999999999999998,"y":1.9000000000000004},{"x":-1.7999999999999998,"y":1.9000000000000004,"via":true,"fromLayer":"inner2","toLayer":"top"},{"x":-1.7999999999999998,"y":1.9000000000000004},{"x":-1.7999999999999998,"y":1.6000619999999994}]',
    width: 0.1,
    innerRoute: [
      { route_type: "wire", x: 13.7, y: 8.3299, layer: "top" },
      { route_type: "via", x: 13.7, y: 8.3299, from_layer: "top", to_layer: "inner2" },
      { route_type: "wire", x: 13.7, y: 8.3299, layer: "inner2" },
      { route_type: "wire", x: 10.85, y: 8.3299, layer: "inner2" },
      { route_type: "wire", x: 10.85, y: 6.95, layer: "inner2" },
      { route_type: "via", x: 10.85, y: 6.95, from_layer: "inner2", to_layer: "top" },
      { route_type: "wire", x: 10.85, y: 6.95, layer: "top" },
      { route_type: "wire", x: 11.149938, y: 6.95, layer: "top" },
    ],
  },
  SD_BULK: {
    jsx: '[{"x":-0.4201000000000015,"y":-0.6398674999999976}]', width: 0.1,
    waypoints: [{ x: 28.9398675, y: -22.4201 }],
  },
  BUCK_FEEDBACK: {
    jsx: '[{"x":-1,"y":2.0998959999999975}]', width: 0.1,
    waypoints: [{ x: -16.800104, y: -14.95 }],
  },
  BUCK_OUTPUT_CAP_A: {
    jsx: '[{"x":-1,"y":-4.700000000000003}]', width: 0.6,
    waypoints: [{ x: -23.6, y: -14.95 }],
  },
  BUCK_OUTPUT_CAP_B: {
    jsx: '[{"x":-3.3499500000000015,"y":0}]', width: 0.6,
    waypoints: [{ x: -22.4, y: -14.45005 }],
  },
  LCD_VDDI_CAP: {
    jsx: '[{"x":-1.1999999999999993,"y":0},{"x":-1.1999999999999993,"y":1.2499982000000003}]', width: 0.1,
    waypoints: [{ x: 32, y: 9.4 }, { x: 32, y: 8.1500018 }],
  },
  LCD_VCI_CAP: {
    jsx: '[{"x":-2,"y":0},{"x":-2,"y":-0.15000380000000035}]', width: 0.1,
    waypoints: [{ x: 31.8, y: 7 }, { x: 31.8, y: 7.1500038 }],
  },
  // Complete the SD0 net with an inward MCU escape and a bottom-layer leg.
  // The separate PSRAM branch reaches the same flash terminal on inner1.
  QSPI_SD0: {
    jsx: '[{ x: -1.599946, y: 2.65 }, { x: -1.599946, y: 2.65, via: true, fromLayer: "top", toLayer: "bottom" }, { x: -1.599946, y: 2.65 }, { x: -6.299999999999999, y: 2.6499999999999995 }, { x: -6.3, y: 7.65 }, { x: -6.3, y: 7.65, via: true, fromLayer: "bottom", toLayer: "top" }, { x: -6.3, y: 7.65 }]',
    width: 0.1,
    innerRoute: [
      { route_type: "wire", x: 1.7999459999999998, y: 12.5, layer: "top" },
      { route_type: "via", x: 1.7999459999999998, y: 12.5, from_layer: "top", to_layer: "bottom" },
      { route_type: "wire", x: 1.7999459999999998, y: 12.5, layer: "bottom" },
      { route_type: "wire", x: 6.499999999999999, y: 12.5, layer: "bottom" },
      { route_type: "wire", x: 6.499999999999999, y: 7.499999999999999, layer: "bottom" },
      { route_type: "via", x: 6.499999999999999, y: 7.499999999999999, from_layer: "bottom", to_layer: "top" },
      { route_type: "wire", x: 6.499999999999999, y: 7.499999999999999, layer: "top" },
    ],
  },
  PSRAM_SIO0: {
    jsx: '[{ x: 1.5, y: 1.50749 }, { x: 1.5, y: 1.50749, via: true, fromLayer: "top", toLayer: "inner1" }, { x: 1.5, y: 1.50749 }, { x: 1.5, y: 1.9000000000000004 }, { x: -4.7, y: 1.9 }, { x: -4.7, y: 1.9, via: true, fromLayer: "inner1", toLayer: "top" }, { x: -4.7, y: 1.9 }]',
    width: 0.1,
    innerRoute: [
      { route_type: "wire", x: 13.4, y: 7.107489999999999, layer: "top" },
      { route_type: "via", x: 13.4, y: 7.107489999999999, from_layer: "top", to_layer: "inner1" },
      { route_type: "wire", x: 13.4, y: 7.107489999999999, layer: "inner1" },
      { route_type: "wire", x: 13.4, y: 7.5, layer: "inner1" },
      { route_type: "wire", x: 7.2, y: 7.5, layer: "inner1" },
      { route_type: "via", x: 7.2, y: 7.5, from_layer: "inner1", to_layer: "top" },
      { route_type: "wire", x: 7.2, y: 7.5, layer: "top" },
    ],
  },
  // SD1's inner1 shoulders clear the SD2 and SCLK physical drill spans.
  // Keep the exact Core-emitted coordinates, including their last bits.
  QSPI_SD1: {
    jsx: '[{ x: -2.400046, y: 2.65 }, { x: -2.400046, y: 2.65, via: true, fromLayer: "top", toLayer: "inner1" }, { x: -2.400046, y: 2.65 }, { x: -2.4000460000000006, y: 6.75 }, { x: -3.6, y: 6.75 }, { x: -4.3, y: 8.45 }, { x: -5.6, y: 9.8 }, { x: -5.6, y: 9.8, via: true, fromLayer: "inner1", toLayer: "top" }, { x: -5.6, y: 9.8 }, { x: -4.550064, y: 9.95 }]',
    width: 0.1,
    innerRoute: [
      { route_type: "wire", x: 2.600046, y: 12.5, layer: "top" },
      { route_type: "via", x: 2.600046, y: 12.5, from_layer: "top", to_layer: "inner1" },
      { route_type: "wire", x: 2.600046, y: 12.5, layer: "inner1" },
      { route_type: "wire", x: 2.600046, y: 8.4, layer: "inner1" },
      { route_type: "wire", x: 3.7999999999999994, y: 8.4, layer: "inner1" },
      { route_type: "wire", x: 4.499999999999999, y: 6.700000000000001, layer: "inner1" },
      { route_type: "wire", x: 5.799999999999999, y: 5.35, layer: "inner1" },
      { route_type: "via", x: 5.799999999999999, y: 5.35, from_layer: "inner1", to_layer: "top" },
      { route_type: "wire", x: 5.799999999999999, y: 5.35, layer: "top" },
      { route_type: "wire", x: 4.750063999999999, y: 5.200000000000001, layer: "top" },
    ],
  },
  PSRAM_SIO1: {
    jsx: "[{ x: -0.249936, y: -0.6 }, { x: -7.149936, y: -0.6 }]", width: 0.1,
    waypoints: [{ x: 11.650064, y: 5 }, { x: 4.750064, y: 5 }],
  },
  // The remaining phase could not reach USB_DP around the memory escapes.
  // R_USB_DP's declared frame is (2.1,9.63), rotated 90 degrees. Use inner1
  // between two clear via sites; keep its neighboring USB_DM trace on top.
  USB_DP: {
    jsx: '[{ x: 0.27, y: 0.8 }, { x: 0.27, y: 0.8, via: true, fromLayer: "top", toLayer: "inner1" }, { x: 0.27, y: 0.8 }, { x: 0.87, y: 2.25 }, { x: 0.87, y: 2.25, via: true, fromLayer: "inner1", toLayer: "top" }, { x: 0.87, y: 2.25 }]',
    width: 0.1,
    innerRoute: [
      { route_type: "wire", x: 1.3, y: 9.9, layer: "top" },
      { route_type: "via", x: 1.3, y: 9.9, from_layer: "top", to_layer: "inner1" },
      { route_type: "wire", x: 1.3, y: 9.9, layer: "inner1" },
      { route_type: "wire", x: -0.1499999999999999, y: 10.5, layer: "inner1" },
      { route_type: "via", x: -0.1499999999999999, y: 10.5, from_layer: "inner1", to_layer: "top" },
      { route_type: "wire", x: -0.1499999999999999, y: 10.5, layer: "top" },
    ],
  },
  USB_DM: {
    jsx: "[{ x: 0.432816, y: 1.1001 }]", width: 0.1,
    waypoints: [{ x: -0.6001000000000001, y: 10.062816000000002 }],
  },
  // Route the complete 1.1 V rail explicitly. C_CORE_P keeps the original
  // net.V1V1 anchor. Distribution branches end at the regulator feedback
  // port; its short capacitor connection retains the decoupling constraint.
  // Inner2 rail vias also occupy inner1 and retain exact native coordinates.
  C_DVDD1_SUPPLY: {
    jsx: "[{x:-2.88,y:-0.450077}]", width: 0.1,
    waypoints: [{ x: -4.2, y: 14.750077000000001 }],
  },
  C_DVDD2_SUPPLY: {
    jsx: "[{x:-1.57,y:-2.3}]", width: 0.1,
    waypoints: [{ x: 0.19999999999999973, y: 19.28 }],
  },
  C_DVDD2_BULK_SUPPLY: {
    jsx: "[{x:-0.420116,y:0.520116}]", width: 0.1,
    waypoints: [{ x: -7.4298839999999995, y: 20.429883999999998 }],
  },
  C_DVDD3_SUPPLY: {
    jsx: "[{x:-2.18,y:-0.499973}]", width: 0.1,
    waypoints: [{ x: 4.699999999999999, y: 14.350026999999999 }],
  },
  CORE_OUT: {
    jsx: "[\".C_CORE > .pin1\"]", width: 0.1,
    waypoints: [{ x: -1.579884, y: 10.1 }],
  },
  VREG_FB: {
    jsx: "[{x:1.20015,y:4.5}]", width: 0.1,
    waypoints: [{ x: -1.0001500000000005, y: 10.65 }],
  },
  DVDD1_V1V1: {
    jsx: '[{x:2.6,y:0.399923},{x:2.6,y:0.399923,via:true,fromLayer:"top",toLayer:"inner2"},{x:2.6,y:0.399923},{x:2.599999999999999,y:5.85},{x:0.4,y:5.85},{x:0.4,y:5.85,via:true,fromLayer:"inner2",toLayer:"top"},{x:0.4,y:5.85},".C_CORE > .pin1",{x:1.20015,y:4.5}]', width: 0.1,
    innerRoute: [
      {route_type: "wire", x: -2.4, y: 14.750077000000001, layer: "top"},
      {route_type: "via", x: -2.4, y: 14.750077000000001, from_layer: "top", to_layer: "inner2"},
      {route_type: "wire", x: -2.4, y: 14.750077000000001, layer: "inner2"},
      {route_type: "wire", x: -2.4, y: 9.3, layer: "inner2"},
      {route_type: "wire", x: -0.20000000000000073, y: 9.3, layer: "inner2"},
      {route_type: "via", x: -0.20000000000000073, y: 9.3, from_layer: "inner2", to_layer: "top"},
      {route_type: "wire", x: -0.20000000000000073, y: 9.3, layer: "top"},
      { route_type: "wire", x: -1.579884, y: 10.1, layer: "top" },
      { route_type: "wire", x: -1.0001500000000005, y: 10.65, layer: "top" },
    ],
  },
  DVDD2_V1V1: {
    jsx: '[{x:0,y:-2.65},{x:0,y:-2.65,via:true,fromLayer:"top",toLayer:"inner2"},{x:0,y:-2.65},{x:-1.0494852848887486e-15,y:5.85},{x:1.1,y:5.85},{x:1.1,y:5.85,via:true,fromLayer:"inner2",toLayer:"top"},{x:1.1,y:5.85},".C_CORE > .pin1",{x:1.20015,y:4.5}]', width: 0.1,
    innerRoute: [
      {route_type: "wire", x: 0.20000000000000034, y: 17.8, layer: "top"},
      {route_type: "via", x: 0.20000000000000034, y: 17.8, from_layer: "top", to_layer: "inner2"},
      {route_type: "wire", x: 0.20000000000000034, y: 17.8, layer: "inner2"},
      {route_type: "wire", x: 0.20000000000000034, y: 9.3, layer: "inner2"},
      {route_type: "wire", x: -0.9000000000000008, y: 9.3, layer: "inner2"},
      {route_type: "via", x: -0.9000000000000008, y: 9.3, from_layer: "inner2", to_layer: "top"},
      {route_type: "wire", x: -0.9000000000000008, y: 9.3, layer: "top"},
      { route_type: "wire", x: -1.579884, y: 10.1, layer: "top" },
      { route_type: "wire", x: -1.0001500000000005, y: 10.65, layer: "top" },
    ],
  },
  DVDD3_V1V1: {
    jsx: '[{x:-2.6,y:0.799973},{x:-2.6,y:0.799973,via:true,fromLayer:"top",toLayer:"inner2"},{x:-2.6,y:0.799973},{x:1.7800000000000007,y:0.7999729999999998},{x:1.78,y:5.85},{x:1.78,y:5.85,via:true,fromLayer:"inner2",toLayer:"top"},{x:1.78,y:5.85},".C_CORE > .pin1",{x:1.20015,y:4.5}]', width: 0.1,
    innerRoute: [
      {route_type: "wire", x: 2.8000000000000003, y: 14.350027, layer: "top"},
      {route_type: "via", x: 2.8000000000000003, y: 14.350027, from_layer: "top", to_layer: "inner2"},
      {route_type: "wire", x: 2.8000000000000003, y: 14.350027, layer: "inner2"},
      {route_type: "wire", x: -1.5800000000000007, y: 14.350027, layer: "inner2"},
      {route_type: "wire", x: -1.5800000000000007, y: 9.3, layer: "inner2"},
      {route_type: "via", x: -1.5800000000000007, y: 9.3, from_layer: "inner2", to_layer: "top"},
      {route_type: "wire", x: -1.5800000000000007, y: 9.3, layer: "top"},
      { route_type: "wire", x: -1.579884, y: 10.1, layer: "top" },
      { route_type: "wire", x: -1.0001500000000005, y: 10.65, layer: "top" },
    ],
  },
}

// Replace net-only branches with explicit same-net endpoints. The original
// BAT_REVERSE_SOURCE still attaches the whole tree to net.BAT_PROTECTED.
// The rendered electrical-group fingerprint must remain exactly unchanged.
const localConnections: Array<{ name: string; field: "from" | "to"; original: string; selector: string }> = [
  { name: "C_QSPI_USB_G", field: "to", original: "net.GND", selector: ".U2 > .EP" },
  { name: "C_IOVDD4_GND", field: "to", original: "net.GND", selector: ".C_IOVDD5 > .pin2" },
  { name: "C_CORE_G", field: "to", original: "net.GND", selector: ".U1 > .VREG_PGND" },
  { name: "R_SHOULDER_GND", field: "to", original: "net.GND", selector: ".J_LCD > .pin11" },
  { name: "VREG_PGND", field: "to", original: "net.GND", selector: ".U1 > .GND" },
  { name: "USB_OTP_VDD", field: "to", original: "net.V3V3", selector: ".U1 > .IOVDD6" },
  { name: "C_IOVDD6_GND", field: "to", original: "net.GND", selector: ".C_DVDD3 > .pin2" },
  { name: "TOUCH_RESET", field: "to", original: ".U1 > .GPIO21", selector: ".J_LCD > .pin10" },
  { name: "QSPI_IOVDD", field: "to", original: "net.V3V3", selector: ".U1 > .USB_OTP_VDD" },
  { name: "ADC_AVDD", field: "to", original: "net.V3V3", selector: ".U1 > .IOVDD1" },
  { name: "LCD_MODE_IM0", field: "to", original: "net.V3V3", selector: ".J_LCD > .pin8" },
  { name: "LCD_MODE_IM1", field: "to", original: "net.V3V3", selector: ".J_LCD > .pin9" },
  { name: "LCD_VDDI_40", field: "to", original: "net.V3V3", selector: ".J_LCD > .pin41" },
  { name: "LCD_VDDI_41", field: "to", original: "net.V3V3", selector: ".J_LCD > .pin42" },
  { name: "TOUCH_SDA_PULLUP_V3V3", field: "to", original: "net.V3V3", selector: ".R_TOUCH_IRQ > .pin2" },
  { name: "TOUCH_SCL_PULLUP_V3V3", field: "to", original: "net.V3V3", selector: ".C_LCD_VCI > .pin1" },
  { name: "C_ADC_P", field: "to", original: "net.V3V3", selector: ".U1 > .IOVDD1" },
  { name: "SD_CMD_PULLUP_V3V3", field: "to", original: "net.V3V3", selector: ".C_SD_BULK > .pin1" },
  { name: "BOOT_PULLUP_3V3", field: "to", original: "net.V3V3", selector: ".C_FLASH > .pin1" },
  { name: "SD_DAT0_PULLUP_V3V3", field: "to", original: "net.V3V3", selector: ".C_SD > .pin1" },
  { name: "SD_CS_PULLUP_V3V3", field: "to", original: "net.V3V3", selector: ".R_SD_DAT2 > .pin2" },
  { name: "C_QSPI_USB_P", field: "to", original: "net.V3V3", selector: ".U1 > .IOVDD6" },
  { name: "FLASH_VCC", field: "to", original: "net.V3V3", selector: ".C_QSPI_USB > .pin1" },
  { name: "C_VREG_IN_P", field: "to", original: "net.V3V3", selector: ".C_FLASH > .pin1" },
  { name: "SD_DAT1_PULLUP_V3V3", field: "to", original: "net.V3V3", selector: ".R_SD_DAT2 > .pin2" },
  { name: "BAT_BUCKBOOST_INPUT", field: "from", original: "net.BAT_PROTECTED", selector: ".Q_BAT_REVERSE > .source" },
  { name: "BAT_BUCKBOOST_INPUT", field: "to", original: ".U_BAT_BUCKBOOST > .VIN", selector: ".C_BAT_IN_LOCAL > .pin1" },
  { name: "BATTERY_TO_SWITCH", field: "from", original: "net.BAT_PROTECTED", selector: ".Q_BAT_REVERSE > .source" },
  { name: "PSRAM_SIO2", field: "to", original: ".U1 > .QSPI_SD2", selector: ".U2 > .pin3" },
  { name: "PSRAM_SIO3", field: "to", original: ".U1 > .QSPI_SD3", selector: ".U2 > .pin7" },
  { name: "PSRAM_SCLK", field: "to", original: ".U1 > .QSPI_SCLK", selector: ".U2 > .pin6" },
  { name: "PSRAM_SIO0", field: "to", original: ".U1 > .QSPI_SD0", selector: ".U2 > .pin5" },
  { name: "PSRAM_SIO1", field: "to", original: ".U1 > .QSPI_SD1", selector: ".U2 > .pin2" },
  { name: "BOOT_PULLUP", field: "to", original: ".U1 > .QSPI_SS", selector: ".U2 > .CS" },
  { name: "BOOTSEL_SERIES", field: "to", original: ".U1 > .QSPI_SS", selector: ".U2 > .CS" },
  { name: "CORE_OUT", field: "to", original: "net.V1V1", selector: ".C_CORE > .pin1" },
  { name: "VREG_FB", field: "to", original: "net.V1V1", selector: ".C_CORE > .pin1" },
  { name: "DVDD1_V1V1", field: "to", original: "net.V1V1", selector: ".U1 > .VREG_FB" },
  { name: "DVDD2_V1V1", field: "to", original: "net.V1V1", selector: ".U1 > .VREG_FB" },
  { name: "DVDD3_V1V1", field: "to", original: "net.V1V1", selector: ".U1 > .VREG_FB" },
]
export const manualTraceNames = Object.keys(manualPaths)

const routingPhases = [
  { name: "clock", traces: ["XIN", "XOUT_DAMPING", "XOUT", "T_C_XIN", "T_C_XOUT"] },
  { name: "switching-power", traces: ["BAT_BUCKBOOST_L1", "BAT_BUCKBOOST_L2", "BUCK_SWITCH", "BUCK_BOOTSTRAP_BST"] },
  { name: "local-decoupling", traces: ["C_VREG_AVDD_P", "C_DVDD3_SUPPLY", "C_DVDD2_BULK_SUPPLY", "C_IOVDD1_SUPPLY", "SD_DECOUPLING", "BAT_OUTPUT_CAP_LOCAL", "BAT_INPUT_CAP_LOCAL"] },
  // Route the existing two-port power branches before the 55-terminal net.
  // This preserves their endpoints, authored widths and length constraints.
  { name: "power-branches", traces: ["C_IOVDD2_SUPPLY", "C_IOVDD3_SUPPLY", "C_IOVDD4_SUPPLY", "C_IOVDD5_SUPPLY", "C_IOVDD6_SUPPLY", "PSRAM_DECOUPLING", "PSRAM_BULK", "SD_BULK", "BUCK_FEEDBACK", "BUCK_OUTPUT_CAP_A", "BUCK_OUTPUT_CAP_B", "LCD_VDDI_CAP", "LCD_VCI_CAP"] },
  // Separate the long board-spanning controls from the remaining signal pass.
  // Preserve every endpoint, width and clearance; only routing order changes.
  { name: "button-controls", traces: ["L_SHOULDER", "R_SHOULDER", "UP", "DN", "LFT", "RGT", "A", "B", "X", "Y", "SEL", "STA"] },
]

// Keep the two largest multi-terminal nets out of the remaining signal pass.
// Explicit local-decoupling trace phases still take precedence over net phases.
const netRoutingPhases = [
  { name: "ground-net", net: "GND" },
  { name: "v3v3-net", net: "V3V3" },
]

// Clock, switching-power and all power-branches now have exact manual paths.
export const expectedAutomaticPhaseNames = ["local-decoupling", "button-controls", "ground-net", "v3v3-net", "remaining-connections"]

export function applyRoutingPlan(source: string): string {
  let result = source
  const replacements: Array<[string, string]> = []
  // Manual pcbPath vias inherit these dimensions, not the minVia* fields.
  // Match the existing board/autorouter dimensions exactly; do not relax DRC.
  const boardMarker = "<board\n"
  if (result.split(boardMarker).length !== 2) throw new Error("Expected one original board")
  const styledBoard = `${boardMarker}    pcbStyle={{ viaPadDiameter: 0.45, viaHoleDiameter: 0.15 }}\n`
  result = result.replace(boardMarker, styledBoard)
  replacements.push([styledBoard, boardMarker])
  // Add copper between already-connected source-net terminals, retaining
  // both original rail attachments and every existing branch constraint.
  const closingBoard = "  </board>"
  if (result.split(closingBoard).length !== 2) throw new Error("Expected one board closing tag")
  const supplyBridge = '    <trace name="IOVDD6_IOVDD5_BRIDGE" from=".C_IOVDD6 > .pin1" to=".C_IOVDD5 > .pin1" thickness={0.6} />\n' +
    '    <trace name="IOVDD4_IOVDD5_BRIDGE" from=".C_IOVDD4 > .pin1" to=".C_IOVDD5 > .pin1" thickness={0.6} />\n'
  result = result.replace(closingBoard, `${supplyBridge}${closingBoard}`)
  replacements.push([`${supplyBridge}${closingBoard}`, closingBoard])
  for (const [phaseIndex, phase] of routingPhases.entries()) {
    for (const name of phase.traces) {
      const marker = `<trace name="${name}"`
      if (result.split(marker).length !== 2) throw new Error(`Expected exactly one ${name} trace`)
      const replacement = `${marker} routingPhaseIndex={${phaseIndex}}`
      result = result.replace(marker, replacement)
      replacements.push([replacement, marker])
    }
  }
  for (const [index, phase] of netRoutingPhases.entries()) {
    const marker = `<net name="${phase.net}"`
    if (result.split(marker).length !== 2) throw new Error(`Expected exactly one ${phase.net} net`)
    const replacement = `${marker} routingPhaseIndex={${routingPhases.length + index}}`
    result = result.replace(marker, replacement)
    replacements.push([replacement, marker])
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
    ...netRoutingPhases.map((phase, index) =>
      `    <autoroutingphase phaseIndex={${routingPhases.length + index}} name="${phase.name}" minTraceToPadEdgeClearance="0.16mm" />`,
    ),
    '    <autoroutingphase name="remaining-connections" minTraceToPadEdgeClearance="0.16mm" />',
  ].join("\n")
  result = result.replace(marker, `${phases}\n\n${marker}`)
  let restored = result.replace(`${phases}\n\n`, "")
  for (const [replacement, marker] of replacements.reverse()) restored = restored.replace(replacement, marker)
  if (restored !== source) throw new Error("Routing plan changed something beyond phases, same-net copper and manual paths")
  return result
}
