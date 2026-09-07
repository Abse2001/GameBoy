import StorageBoard from "./placement-published-mcu-header-module.circuit"

export default () => (
  <StorageBoard
    mcuSubcircuit
    psramCapEscape
    mcuPassiveEscape
    usbResistorEscape
    clockPassiveEscape
    westDecouplerEscape
    sdDetectEscape
  />
)
