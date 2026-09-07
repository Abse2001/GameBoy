import Board from "./placement-storage-gba-controls-spi-centered-clock-first.circuit"

export default () => (
  <Board
    routeClockFirst={false}
    mcuPeripheralPlacements={{
      U2: { pcbX: -2.6, pcbY: 7, pcbRotation: 180 },
    }}
  />
)
