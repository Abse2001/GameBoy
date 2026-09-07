import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Preserve the MCU pad order at the USB series resistors.
export default () => <StorageBoard mcuSubcircuit={false} usbResistorEscape />
