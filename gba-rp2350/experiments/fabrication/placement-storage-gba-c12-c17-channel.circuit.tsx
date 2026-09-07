import Board from "./placement-storage-gba-controls-spi-centered-clock-first.circuit"

export default () => (
  <Board
    routeClockFirst={false}
    mcuPeripheralPlacements={{
      C12: { pcbX: -0.2, pcbY: 3.8, pcbRotation: 90 },
      C17: { pcbX: 5.3, pcbY: 0.9, pcbRotation: 90 },
    }}
  />
)
