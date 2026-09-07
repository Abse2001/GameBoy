import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Combine MCU passive spacing with the USB resistor pad-order experiment.
export default () => <StorageBoard mcuSubcircuit={false} psramCapEscape mcuPassiveEscape usbResistorEscape />
