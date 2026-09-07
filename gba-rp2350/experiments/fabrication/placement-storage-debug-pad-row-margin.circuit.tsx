import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Compare the same physical placement with additional routing clearance.
export default () => (
  <StorageBoard
    mcuSubcircuit={false}
    psramCapEscape
    mcuPassiveEscape
    usbResistorEscape
    clockPassiveEscape
    westDecouplerEscape
    sdDetectEscape
    routingSafetyMargin
    mcuDebugTestpointPlacements={{
      TP_SWDIO: { pcbX: -8, pcbY: 4.7 },
      TP_SWCLK: { pcbX: -8, pcbY: 3.2 },
    }}
  />
)
