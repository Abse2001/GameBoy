import Board from "./placement-storage-gba-controls-spi-centered-clock-first.circuit"

export default () => (
  <Board
    routeClockFirst={false}
    mcuPeripheralPlacements={{
      C18: { pcbX: 1.6, pcbY: -5.55, pcbRotation: 0 },
    }}
  />
)
