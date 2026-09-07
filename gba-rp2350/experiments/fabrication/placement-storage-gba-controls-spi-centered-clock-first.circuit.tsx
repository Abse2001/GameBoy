import type { ReactNode } from "react"
import StorageBoard from "./placement-published-mcu-header-module.circuit"
import type { RP2350CompactLayoutProps } from "./published-rp2350-v0.0.11/pico-layout.circuit"

export default ({
  children,
  pipeline,
  internalConnectors = false,
  restoredControls = false,
  mcuSignalFanout = false,
  groundPlaneFanout = false,
  segmentedSupplyPours = false,
  routeClockFirst = false,
  mcuPriorityTraceNames,
  mcuGroundEscape,
  routingSafetyMargin = false,
  mcuPeripheralPlacements,
  mcuDebugTestpointPlacements,
  sdHfCapRotation,
}: { children?: ReactNode; pipeline?: 7 | 9; mcuPriorityTraceNames?: string[]; internalConnectors?: boolean; groundPlaneFanout?: boolean; mcuSignalFanout?: boolean; restoredControls?: boolean; mcuGroundEscape?: "fanout" | "fanout-inward" | "beta-pipeline9"; segmentedSupplyPours?: boolean; routeClockFirst?: boolean; routingSafetyMargin?: boolean; mcuPeripheralPlacements?: RP2350CompactLayoutProps["peripheralPlacements"]; mcuDebugTestpointPlacements?: RP2350CompactLayoutProps["debugTestpointPlacements"]; sdHfCapRotation?: number } = {}) => (
  <StorageBoard
    children={children}
    pipeline={pipeline}
    internalConnectors={internalConnectors}
    restoredControls={restoredControls}
    mcuSignalFanout={mcuSignalFanout}
    groundPlaneFanout={groundPlaneFanout}
    gbaHousingFit
    mcuPcbY={7}
    mcuSubcircuit={false}
    routeClockFirst={routeClockFirst}
    mcuPriorityTraceNames={mcuPriorityTraceNames}
    mcuGroundEscape={mcuGroundEscape}
    segmentedSupplyPours={segmentedSupplyPours}
    routingSafetyMargin={routingSafetyMargin}
    sdHfCapRotation={sdHfCapRotation}
    psramCapEscape
    mcuPassiveEscape
    flashCapEscape
    usbResistorEscape
    clockPassiveEscape
    westDecouplerEscape
    mcuDebugTestpointPlacements={{
      TP_SWDIO: { pcbX: -18, pcbY: 18 },
      ...mcuDebugTestpointPlacements,
    }}
    mcuPeripheralPlacements={{
      U_RUN: { pcbX: -9, pcbY: 9 },
      R_RUN: { pcbX: -13, pcbY: 9, pcbRotation: 90 },
      U_RGB_BUF: { pcbX: 8, pcbY: 8, pcbRotation: 270 },
      C_RGB_BUF: { pcbX: 5.4, pcbY: 9.8, pcbRotation: 270 },
      R_RGB_DATA: { pcbX: 8.95, pcbY: 12, pcbRotation: 90 },
      J_STEMMA_QT: { pcbX: 10.5, pcbY: -39, pcbRotation: 0 },
      J_SPI: { pcbX: 22, pcbY: -39, pcbRotation: 0 },
      J_USB: { pcbX: 8.5, pcbY: 25.25, pcbRotation: 180 },
      R_CC1: { pcbX: 4.5, pcbY: 20, pcbRotation: 90 },
      R_CC2: { pcbX: 12.5, pcbY: 20, pcbRotation: 90 },
      C_VBUS: { pcbX: 15.5, pcbY: 24, pcbRotation: 90 },
      R_PWR_LED: { pcbX: 15.5, pcbY: 20.5, pcbRotation: 90 },
      D_PWR: { pcbX: 15.5, pcbY: 17.5, pcbRotation: 90 },
      R_STEMMA_POWER: { pcbX: 10.5, pcbY: -34, pcbRotation: 90 },
      D_RGB: { pcbX: 20, pcbY: 11, pcbRotation: 270 },
      C_RGB: { pcbX: 16.5, pcbY: 11, pcbRotation: 270 },
      TP_GND: { pcbX: -15.5, pcbY: 18 },
      TP_3V3: { pcbX: -13, pcbY: 18 },
      ...mcuPeripheralPlacements,
    }}
  />
)
