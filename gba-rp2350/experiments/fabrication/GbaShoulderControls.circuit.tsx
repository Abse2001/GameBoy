import type { GroupProps } from "@tscircuit/props"
import { SKRTLAE010 } from "./imports/SKRTLAE010/SKRTLAE010"
import { A_0402WGF1002TCE } from "./imports/A_0402WGF1002TCE/A_0402WGF1002TCE"

// Ordinary placement group: every connection is routed by the global board.
// These are top-mounted side-actuated switches, not top-push substitutes.
// Their stems face the top board edge; original-shell actuator fit still needs
// a mechanical check against the chosen housing.
export const GbaShoulderControls = (props: GroupProps) => (
  <group {...props}>
    <SKRTLAE010 name="SW_L" pcbX={-62.2} pcbY={34.2} pcbRotation={180} schX={0} schY={0} />
    <SKRTLAE010 name="SW_R" pcbX={62.2} pcbY={34.2} pcbRotation={180} schX={7} schY={0} />
    <A_0402WGF1002TCE name="R_L_PULLUP" pcbX={-59.8} pcbY={30.5} pcbRotation={90} schX={0} schY={3} schOrientation="vertical" />
    <A_0402WGF1002TCE name="R_R_PULLUP" pcbX={59.8} pcbY={30.5} pcbRotation={90} schX={7} schY={3} schOrientation="vertical" />
    <A_0402WGF1002TCE name="R_SPI_CS_PULLUP" pcbX={25.5} pcbY={-25.4} pcbRotation={90} schX={14} schY={3} schOrientation="vertical" />

    {/* External 10k pull-ups make the active-low inputs defined at reset.
        Firmware must debounce the switches and configure both pins as inputs. */}
    <trace name="SHOULDER_L" from=".SW_L > .pin2" to=".MCU .MCU_CORE .U1 > .GPIO28_ADC2" />
    <trace name="SHOULDER_R" from=".SW_R > .pin2" to=".MCU .MCU_CORE .U1 > .GPIO8" />
    <trace from=".SW_L > .pin1" to="net.GND" />
    <trace from=".SW_R > .pin1" to="net.GND" />
    <trace from=".R_L_PULLUP > .pin1" to=".SW_L > .pin2" />
    <trace from=".R_R_PULLUP > .pin1" to=".SW_R > .pin2" />
    <trace from=".R_L_PULLUP > .pin2" to="net.V3V3" />
    <trace from=".R_R_PULLUP > .pin2" to="net.V3V3" />
    {/* GPIO22 is a software-controlled chip select, independent of LCD GPIO17
        and SD GPIO1. Keep an attached SPI device deselected during reset. */}
    <trace from=".R_SPI_CS_PULLUP > .pin1" to=".MCU .J_SPI > .CS" />
    <trace from=".R_SPI_CS_PULLUP > .pin2" to="net.V3V3" />
  </group>
)
