import StorageBoard from "./placement-published-mcu-header-module.circuit"

// Automatically fan the RP2350 pads out before Pipeline 9 routes the full
// board. No breakout points, stored paths, or manual traces are supplied.
export default () => (
  <StorageBoard
    mcuSubcircuit={false}
    psramCapEscape
    mcuPassiveEscape
    usbResistorEscape
    clockPassiveEscape
    westDecouplerEscape
    automaticU1Fanout
  />
)
