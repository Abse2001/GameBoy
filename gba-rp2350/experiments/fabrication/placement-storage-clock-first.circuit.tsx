import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Route the existing oscillator signal connections first; every path is automatic.
export default () => <StorageBoard mcuSubcircuit={false} psramCapEscape mcuPassiveEscape usbResistorEscape clockPassiveEscape westDecouplerEscape sdDetectEscape routeClockFirst />
