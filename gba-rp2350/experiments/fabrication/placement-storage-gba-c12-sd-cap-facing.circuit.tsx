import Board from "./placement-storage-gba-controls-spi-centered-clock-first.circuit"

// Keep the C12 candidate and reverse only the SD bypass capacitor's pad order.
// The socket, capacitor center, values, netlist and route constraints stay fixed.
export default () => (
  <Board
    routeClockFirst={false}
    sdHfCapRotation={270}
    mcuPeripheralPlacements={{
      C12: { pcbX: -0.2, pcbY: 3.8, pcbRotation: 90 },
    }}
  />
)
