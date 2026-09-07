import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Keep the reset branch east of the MCU while routing the zero-via oscillator
// network first. Both changes preserve the netlist and use Pipeline 9 only.
export default () => (
  <StorageBoard
    mcuSubcircuit={false}
    routeClockFirst
    psramCapEscape
    mcuPassiveEscape
    usbResistorEscape
    clockPassiveEscape
    westDecouplerEscape
    mcuDebugTestpointPlacements={{
      TP_SWDIO: { pcbX: -8, pcbY: 2.5 },
      TP_SWCLK: { pcbX: -8, pcbY: 0.8 },
    }}
    mcuPeripheralPlacements={{
      U_RUN: { pcbX: 13, pcbY: 4 },
      R_RUN: { pcbX: 18, pcbY: 4, pcbRotation: 90 },
      U_RGB_BUF: { pcbX: 8, pcbY: 8, pcbRotation: 270 },
      C_RGB_BUF: { pcbX: 5.4, pcbY: 9.8, pcbRotation: 270 },
      R_RGB_DATA: { pcbX: 8.95, pcbY: 12, pcbRotation: 90 },
    }}
  />
)
