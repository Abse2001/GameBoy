import Board from "./placement-storage-gba-controls-spi-centered-clock-first.circuit"

export default () => (
  <Board
    mcuGroundEscape="fanout"
    mcuPeripheralPlacements={{
      C12: { pcbX: -0.2, pcbY: 3.8, pcbRotation: 90 },
      C14: { pcbX: 4.9, pcbY: -1.1, pcbRotation: 0 },
    }}
  />
)
