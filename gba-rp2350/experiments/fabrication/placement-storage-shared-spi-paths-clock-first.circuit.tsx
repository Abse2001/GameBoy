import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Model each shared SPI signal as one multi-terminal electrical trace so the
// autorouter owns every branch and MCU endpoint together. No PCB path is
// specified; Pipeline 9 still generates all route geometry.
export default () => (
  <StorageBoard
    mcuSubcircuit={false}
    mcuHeaders={false}
    sharedSpiTracePaths
    routeClockFirst
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
