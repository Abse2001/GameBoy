import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Align the existing SWD pads with the RP2350's north pad row so Pipeline 9
// can leave the package laterally instead of crossing the SPI fan-in above it.
export default () => (
  <StorageBoard
    mcuSubcircuit={false}
    psramCapEscape
    mcuPassiveEscape
    usbResistorEscape
    clockPassiveEscape
    westDecouplerEscape
    sdDetectEscape
    mcuDebugTestpointPlacements={{
      TP_SWDIO: { pcbX: -8, pcbY: 4.7 },
      TP_SWCLK: { pcbX: -8, pcbY: 3.2 },
    }}
  />
)
