import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Keep the oscillator and the shared GPIO17 escape on top copper before the
// global Pipeline 9 route. All paths remain autorouter-generated.
export default () => (
  <StorageBoard
    mcuSubcircuit={false}
    routeClockFirst
    psramCapEscape
    mcuPassiveEscape
    usbResistorEscape
    clockPassiveEscape
    westDecouplerEscape
    mcuLocalSameLayerEscapes
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
