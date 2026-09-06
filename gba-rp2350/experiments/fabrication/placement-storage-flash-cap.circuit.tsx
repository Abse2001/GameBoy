import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Keep the existing decoupler next to U2.VCC; all traces remain automatic.
export default () => <StorageBoard mcuSubcircuit={false} psramCapEscape mcuPassiveEscape usbResistorEscape clockPassiveEscape westDecouplerEscape sdDetectEscape flashCapEscape />
