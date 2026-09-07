import type { ReactNode } from "react"
import Board from "./index.circuit"
import type { RP2350CompactLayoutProps } from "./published-rp2350-v0.0.11/pico-layout.circuit"

export default ({
  children,
  pipeline = 9,
  internalConnectors = false,
  restoredControls = false,
  mcuSignalFanout = false,
  groundPlaneFanout = false,
  mcuSubcircuit = false,
  mcuHeaders = false,
  routeClockFirst = false,
  mcuPriorityTraceNames,
  mcuGroundEscape,
  psramCapEscape = false,
  mcuPassiveEscape = false,
  clockPassiveEscape = false,
  westDecouplerEscape = false,
  eastSupplyCapEscape = false,
  clockResistorEscape = false,
  mcuLocalSameLayerEscapes = false,
  mcuPeripheralPlacements,
  sdDetectEscape = false,
  sdHfCapRotation,
  debugTestpointEscape = false,
  mcuDebugTestpointPlacements,
  flashCapEscape = false,
  usbResistorEscape = false,
  segmentedSupplyPours = false,
  routingSafetyMargin = false,
  gbaHousingFit = false,
  mcuPcbX = 0,
  mcuPcbY = 0,
}: { children?: ReactNode; pipeline?: 7 | 9; mcuPriorityTraceNames?: string[]; internalConnectors?: boolean; groundPlaneFanout?: boolean; mcuSignalFanout?: boolean; restoredControls?: boolean; mcuGroundEscape?: "fanout" | "fanout-inward" | "beta-pipeline9"; mcuSubcircuit?: boolean; mcuHeaders?: boolean; routeClockFirst?: boolean; psramCapEscape?: boolean; mcuPassiveEscape?: boolean; clockPassiveEscape?: boolean; westDecouplerEscape?: boolean; eastSupplyCapEscape?: boolean; clockResistorEscape?: boolean; mcuLocalSameLayerEscapes?: boolean; mcuPeripheralPlacements?: RP2350CompactLayoutProps["peripheralPlacements"]; sdDetectEscape?: boolean; sdHfCapRotation?: number; debugTestpointEscape?: boolean; mcuDebugTestpointPlacements?: Partial<Record<"TP_SWDIO" | "TP_SWCLK", { pcbX: number; pcbY: number }>>; flashCapEscape?: boolean; usbResistorEscape?: boolean; segmentedSupplyPours?: boolean; routingSafetyMargin?: boolean; gbaHousingFit?: boolean; mcuPcbX?: number; mcuPcbY?: number } = {}) => (
  <Board
    children={children}
    internalConnectors={internalConnectors}
    restoredControls={restoredControls}
    mcuSignalFanout={mcuSignalFanout}
    groundPlaneFanout={groundPlaneFanout}
    publishedMcuModule
    storage
    psramCapEscape={psramCapEscape}
    mcuPassiveEscape={mcuPassiveEscape}
    clockPassiveEscape={clockPassiveEscape}
    westDecouplerEscape={westDecouplerEscape}
    eastSupplyCapEscape={eastSupplyCapEscape}
    clockResistorEscape={clockResistorEscape}
    mcuLocalSameLayerEscapes={mcuLocalSameLayerEscapes}
    mcuPeripheralPlacements={mcuPeripheralPlacements}
    sdDetectEscape={sdDetectEscape}
    sdHfCapRotation={sdHfCapRotation}
    debugTestpointEscape={debugTestpointEscape}
    mcuDebugTestpointPlacements={mcuDebugTestpointPlacements}
    flashCapEscape={flashCapEscape}
    usbResistorEscape={usbResistorEscape}
    segmentedSupplyPours={segmentedSupplyPours}
    routingSafetyMargin={routingSafetyMargin}
    gbaHousingFit={gbaHousingFit}
    mcuPcbX={mcuPcbX}
    mcuPcbY={mcuPcbY}
    mcuHeaders={mcuHeaders}
    mcuSubcircuit={mcuSubcircuit}
    routeClockFirst={routeClockFirst}
    mcuPriorityTraceNames={mcuPriorityTraceNames}
    mcuGroundEscape={mcuGroundEscape}
    allGlobal
    layers={4}
    copperIslands={false}
    router={pipeline === 7 ? "auto" : "beta-pipeline9"}
    autorouterVersion={pipeline === 7 ? "beta_pipeline7" : undefined}
    effort="5x"
    edgeConnectors
    innerButtonContacts
    ldoOffset={{ x: -12, y: 0 }}
    powerOffsetX={gbaHousingFit ? 1 : 0}
    powerOffsetY={gbaHousingFit ? 3 : -3}
    powerPlacements={{
      R_BOOST_EN_PULLUP: { pcbX: 1.5, pcbY: 26.25, pcbRotation: 90 },
      R_BAT_GATE_PULLUP: { pcbX: -11.5, pcbY: 17, pcbRotation: 90 },
      R_BAT_GATE_BASE: gbaHousingFit
        ? { pcbX: -14.5, pcbY: 23.75, pcbRotation: 90 }
        : { pcbX: -14.5, pcbY: 26.25, pcbRotation: 90 },
      D_BAT_BOOST: { pcbX: 19, pcbY: 24, pcbRotation: 180 },
      R_BOOST_TOP: { pcbX: 11.5, pcbY: 18, pcbRotation: 90 },
      R_BOOST_BOT: { pcbX: 8.5, pcbY: 18, pcbRotation: 90 },
      R_USB_BOOST_OFF: { pcbX: 23, pcbY: 25, pcbRotation: 90 },
      Q_USB_BOOST_OFF: { pcbX: 27, pcbY: 18.25, pcbRotation: 0 },
      R_USB_BOOST_OFF_PULLDOWN: { pcbX: 25, pcbY: 27, pcbRotation: 90 },
    }}
    usbDiodeOffset={{ x: gbaHousingFit ? -8 : -13, y: gbaHousingFit ? -8 : -2 }}
    audioVrefPlacement={{ pcbX: 16.7, pcbY: -13, pcbRotation: 90 }}
    audioPlacements={{
      R_AMP_IN: { pcbX: 9.4, pcbY: 0, pcbRotation: -90 },
      C_AMP_PWM_FILTER: { pcbX: 11, pcbY: 0, pcbRotation: 90 },
      C_AMP_IN_COUPLE: { pcbX: 10, pcbY: -7, pcbRotation: 0 },
      C_AMP_VDD: { pcbX: 22, pcbY: -8, pcbRotation: -90 },
      C_AMP_VDD_BULK: { pcbX: 22.5, pcbY: -3, pcbRotation: -90 },
      FB_SPK_POS: { pcbX: 18, pcbY: 9, pcbRotation: 90 },
    }}
    powerSwitchX={62}
    topLeftMountingHole={{ x: -58, y: -34 }}
  />
)
