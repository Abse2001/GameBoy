import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Keep every route automatic and two-terminal. Shared SPI and RUN signals
// branch at existing pads instead of creating duplicate routes at the RP2350,
// while short oscillator and decoupling connections are routed first.
export default () => (
  <StorageBoard
    mcuSubcircuit={false}
    mcuHeaders={false}
    chainSharedSignalTraces
    routeClockFirst
    routeDecouplingFirst
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
    mcuPeripheralPlacements={{
      U_RUN: { pcbX: -9, pcbY: 9 },
      R_RUN: { pcbX: -13, pcbY: 9, pcbRotation: 90 },
      U_RGB_BUF: { pcbX: 8, pcbY: 8, pcbRotation: 270 },
      C_RGB_BUF: { pcbX: 5.4, pcbY: 9.8, pcbRotation: 270 },
      R_RGB_DATA: { pcbX: 8.95, pcbY: 12, pcbRotation: 90 },
    }}
  />
)
