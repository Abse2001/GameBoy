import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Open the west MCU escape corridor while retaining all decoupling connections.
export default () => <StorageBoard mcuSubcircuit={false} psramCapEscape mcuPassiveEscape usbResistorEscape clockPassiveEscape westDecouplerEscape />
