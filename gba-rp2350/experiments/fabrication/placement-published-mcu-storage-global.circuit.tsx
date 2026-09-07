import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Identical parts, placements and netlist, but one global routing scope.
export default () => <StorageBoard mcuSubcircuit={false} />
