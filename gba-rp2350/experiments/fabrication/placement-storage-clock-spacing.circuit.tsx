import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Align the clock passives while retaining the crystal position and connectivity.
export default () => <StorageBoard mcuSubcircuit={false} psramCapEscape mcuPassiveEscape usbResistorEscape clockPassiveEscape />
