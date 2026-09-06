import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Shorten the existing SWDIO test-point connection; no new pad or route is added.
export default () => <StorageBoard mcuSubcircuit={false} psramCapEscape mcuPassiveEscape usbResistorEscape clockPassiveEscape westDecouplerEscape sdDetectEscape debugTestpointEscape />
