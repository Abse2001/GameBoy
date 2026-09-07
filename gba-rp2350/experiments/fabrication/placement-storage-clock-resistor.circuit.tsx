import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Move the real series resistor outside the MCU-to-crystal corridor; X1 stays fixed.
export default () => <StorageBoard mcuSubcircuit={false} psramCapEscape mcuPassiveEscape usbResistorEscape clockPassiveEscape westDecouplerEscape clockResistorEscape />
