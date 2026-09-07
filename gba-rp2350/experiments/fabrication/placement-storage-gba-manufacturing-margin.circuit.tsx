import HousingBoard from "./placement-storage-gba-controls-spi-centered-clock-first.circuit"

// Ask routing for extra pad/via clearance; retain all physical acceptance checks.
export default () => <HousingBoard routeClockFirst={false} routingSafetyMargin />
