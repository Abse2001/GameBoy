import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Same capacitor placement; compare native, separately assigned supply zones.
// No source connection is removed or replaced by assumed island connectivity.
export default () => (
  <StorageBoard mcuSubcircuit={false} psramCapEscape segmentedSupplyPours />
)
