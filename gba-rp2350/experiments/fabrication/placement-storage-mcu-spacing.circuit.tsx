import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Spread the MCU supply passives and QSPI flash without changing connectivity.
export default () => <StorageBoard mcuSubcircuit={false} psramCapEscape mcuPassiveEscape />
