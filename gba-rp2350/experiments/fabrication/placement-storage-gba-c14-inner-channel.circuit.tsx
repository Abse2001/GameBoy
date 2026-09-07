import Board from "./placement-storage-gba-controls-spi-centered-clock-first.circuit"

export default () => (
  <Board
    routeClockFirst={false}
    mcuPeripheralPlacements={{
      C12: { pcbX: -0.2, pcbY: 3.8, pcbRotation: 90 },
      // Align the supply pad with IOVDD2 on the MCU side of C11.
      C14: { pcbX: 4.9, pcbY: -1.1, pcbRotation: 0 },
    }}
  />
)
