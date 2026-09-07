import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Keep the existing SWD pads close to their north-facing MCU pins and move
// their autorouted escapes sideways, away from the shared SPI fan-in corridor.
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
      TP_SWDIO: { pcbX: -8, pcbY: 2.5 },
      TP_SWCLK: { pcbX: -8, pcbY: 0.8 },
    }}
  />
)
