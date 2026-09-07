import Board from "./placement-storage-gba-controls-spi-centered-clock-first.circuit"

export default () => (
  <Board
    routeClockFirst
    mcuPeripheralPlacements={{
      C12: { pcbX: -0.2, pcbY: 3.8, pcbRotation: 90 },
    }}
  />
)
