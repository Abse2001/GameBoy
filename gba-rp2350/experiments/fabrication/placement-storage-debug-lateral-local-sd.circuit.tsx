import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Compare the same SWD placement while keeping the SD card-detect pull-up at
// the card socket, avoiding another component in the MCU escape field.
export default () => (
  <StorageBoard
    mcuSubcircuit={false}
    psramCapEscape
    mcuPassiveEscape
    usbResistorEscape
    clockPassiveEscape
    westDecouplerEscape
    mcuDebugTestpointPlacements={{
      TP_SWDIO: { pcbX: -8, pcbY: 2.5 },
      TP_SWCLK: { pcbX: -8, pcbY: 0.8 },
    }}
  />
)
