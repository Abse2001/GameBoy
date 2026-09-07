import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Move only the PSRAM HF capacitor out of the shared flash/RAM signal corridor.
export default () => <StorageBoard mcuSubcircuit={false} psramCapEscape />
