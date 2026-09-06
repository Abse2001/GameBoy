import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Bring C10 toward DVDD2; move C3 beside the fixed crystal to leave room.
export default () => <StorageBoard mcuSubcircuit={false} psramCapEscape mcuPassiveEscape usbResistorEscape clockPassiveEscape westDecouplerEscape sdDetectEscape eastSupplyCapEscape />
