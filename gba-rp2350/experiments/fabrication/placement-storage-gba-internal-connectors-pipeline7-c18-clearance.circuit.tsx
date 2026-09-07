import InternalConnectorsBoard from "./placement-storage-gba-internal-connectors.circuit"

// Open the north-side clock-pad approach by moving only its neighboring
// IOVDD4 decoupler east. U1, the crystal and oscillator parts stay fixed.
// One global Pipeline 7 pass, with no authored or stored routing.
export default () => (
  <InternalConnectorsBoard
    pipeline={7}
    mcuPeripheralPlacements={{
      C_IOVDD1: { pcbX: 7.2, pcbY: 2.1, pcbRotation: 0 },
      C18: { pcbX: -2.7, pcbY: -5.55, pcbRotation: 180 },
    }}
  />
)
