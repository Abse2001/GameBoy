import type { ReactNode } from "react"
import Board from "./placement-storage-gba-controls-spi-centered-clock-first.circuit"
import type { RP2350CompactLayoutProps } from "./published-rp2350-v0.0.11/pico-layout.circuit"

// Battery and speaker access belongs inside the enclosure. The other external
// connectors and all buttons retain their positions. All copper is autorouted.
export default ({
  children,
  pipeline,
  routeClockFirst = false,
  mcuPriorityTraceNames,
  mcuPeripheralPlacements,
  mcuDebugTestpointPlacements,
}: { children?: ReactNode; pipeline?: 7 | 9; routeClockFirst?: boolean; mcuPriorityTraceNames?: string[]; mcuPeripheralPlacements?: RP2350CompactLayoutProps["peripheralPlacements"]; mcuDebugTestpointPlacements?: RP2350CompactLayoutProps["debugTestpointPlacements"] } = {}) => (
  <Board
    children={children}
    pipeline={pipeline}
    restoredControls
    internalConnectors
    routeClockFirst={routeClockFirst}
    mcuPriorityTraceNames={mcuPriorityTraceNames}
    mcuDebugTestpointPlacements={mcuDebugTestpointPlacements}
    mcuPeripheralPlacements={{
      C12: { pcbX: -0.2, pcbY: 3.8, pcbRotation: 90 },
      C14: { pcbX: 4.9, pcbY: -1.1, pcbRotation: 0 },
      L1: { pcbX: 3.3, pcbY: 4.3, pcbRotation: 180 },
      C_FLASH: { pcbX: -0.3, pcbY: 8.7, pcbRotation: 180 },
      // Open the MCU feedback escape space while keeping C6 close to VIN.
      C6: { pcbX: 1.2, pcbY: 4.4, pcbRotation: 90 },
      ...mcuPeripheralPlacements,
    }}
  />
)
