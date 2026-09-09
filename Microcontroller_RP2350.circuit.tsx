import { RP2350A } from "./imports/RP2350A"
import { W25Q16JVUXIQ } from "./imports/W25Q16JVUXIQ"
import { X322512MSB4SI } from "./imports/X322512MSB4SI"
import { SKRPACE010 } from "./imports/SKRPACE010"
import { AOTA_B201610S3R3_101_T } from "./imports/AOTA_B201610S3R3_101_T"
import { TYPE_C_16PIN_2MD_073_ } from "./imports/TYPE_C_16PIN_2MD_073_"
import { Fragment } from "react"

type MicrocontrollerRP2350Props = {
  name?: string
  subcircuit?: boolean
  pcbX?: string | number
  pcbY?: string | number
  pcbRotation?: string | number
  schX?: string | number
  schY?: string | number
  schRotation?: string | number
}

const gndLabel = { displayName: "GND", schDisplayLabel: "GND" } as const
const v3v3Label = { displayName: "V3V3", schDisplayLabel: "V3V3" } as const
const v1v1Label = { displayName: "V1V1", schDisplayLabel: "V1V1" } as const
const vbusLabel = { displayName: "VBUS", schDisplayLabel: "VBUS" } as const
const denseTraceProps = { thickness: "0.1mm" } as const

const gpioNets = [
  "GPIO0",
  "GPIO1",
  "GPIO2",
  "GPIO3",
  "GPIO4",
  "GPIO5",
  "GPIO6",
  "GPIO7",
  "GPIO8",
  "GPIO9",
  "GPIO10",
  "GPIO11",
  "GPIO12",
  "GPIO13",
  "GPIO14",
  "GPIO15",
  "GPIO16",
  "GPIO17",
  "GPIO18",
  "GPIO19",
  "GPIO20",
  "GPIO21",
  "GPIO22",
  "GPIO23",
  "GPIO24",
  "GPIO25",
  "GPIO26_ADC0",
  "GPIO27_ADC1",
  "GPIO28_ADC2",
  "GPIO29_ADC3",
] as const

const parentRoutedGpios = new Set([
  "GPIO2",
  "GPIO3",
  "GPIO4",
  "GPIO5",
  "GPIO6",
  "GPIO7",
  "GPIO8",
  "GPIO9",
  "GPIO10",
  "GPIO11",
  "GPIO16",
  "GPIO17",
  "GPIO18",
  "GPIO19",
  "GPIO20",
  "GPIO21",
  "GPIO22",
])

const iovddPins = ["IOVDD1", "IOVDD2", "IOVDD3", "IOVDD4", "IOVDD5", "IOVDD6"] as const
const dvddPins = ["DVDD1", "DVDD2", "DVDD3"] as const

/**
 * Bare RP2350A microcontroller core.
 *
 * The RP2350A symbol and QFN-60 footprint are imported from JLCPCB part
 * C42411118. Its surrounding flash, crystal, reset, debug, and supply
 * topology follows the local Pico subcircuit, updated for the RP2350's
 * switching core regulator.
 */
export const Microcontroller_RP2350 = (props: MicrocontrollerRP2350Props) => (
  <group
    name="MICROCONTROLLER_RP2350"
    subcircuit={props.subcircuit ?? true}
    autorouter="auto"
    {...props}
  >
    <net name="GND" />
    <net name="VBUS" />
    <net name="V3V3" />
    <net name="V1V1" />

    <RP2350A
      name="U1"
      noConnect={gpioNets.filter((gpio) => !parentRoutedGpios.has(gpio))}
      showPinAliases
      schSectionName="rp2350"
      pcbX={0}
      pcbY={0}
      schX={0}
      schY={0}
      schWidth={2.8}
      schHeight={6.2}
    />

    {/* The external QSPI flash and 12 MHz crystal are reused from the local Pico. */}
    <W25Q16JVUXIQ
      name="U2"
      schSectionName="flash"
      pcbX={8.2}
      pcbY={2.8}
      schX={8}
      schY={0}
      schHeight={1}
    />
    <X322512MSB4SI
      name="U_XTAL"
      schSectionName="clock"
      pcbX={0}
      pcbY={8}
      schX={-7.6}
      schY={6.2}
    />
    <SKRPACE010 name="U_BOOTSEL" schSectionName="controls" pcbX={10} pcbY={8.5} schX={8.5} schY={5.2} />
    <SKRPACE010 name="U_RUN" schSectionName="controls" pcbX={-10} pcbY={-2.5} schX={-9.05} schY={-4.6} />

    {/* USB-C receptacle, matching the Pico's USB 2.0 device-side topology. */}
    <TYPE_C_16PIN_2MD_073_
      name="J_USB"
      pinAttributes={{ B8: { doNotConnect: true }, A8: { doNotConnect: true } }}
      schSectionName="usb"
      pcbX={0}
      pcbY={-20}
      schX={11}
      schY={-5.5}
    />

    {/* RP2350 core regulator: follow the Raspberry Pi 3.3 uH / 4.7 uF topology. */}
    <AOTA_B201610S3R3_101_T
      name="U_CORE_INDUCTOR"
      schSectionName="power"
      pcbX={6.5}
      pcbY={-5.2}
      schX={9.5}
      schY={-4.5}
    />
    <resistor name="R_VREG_AVDD" resistance="33" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C25105"] }} schSectionName="power" pcbX={-6.7} pcbY={-7} schX={-6.95} schY={-3.4} />
    <resistor name="R_RUN" resistance="10k" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C25744"] }} schSectionName="controls" pcbX={-6.4} pcbY={-8.1} schX={-5.65} schY={-4.6} />
    <resistor name="R_BOOT" resistance="10k" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C25744"] }} schSectionName="flash" pcbX={5.7} pcbY={6.6} schX={7.33} schY={4.2} />
    <resistor name="R_CC1" resistance="5.1k" footprint="0402" schSectionName="usb" pcbX={-3.5} pcbY={-13.8} schX={7.2} schY={-5.2} />
    <resistor name="R_CC2" resistance="5.1k" footprint="0402" schSectionName="usb" pcbX={3.5} pcbY={-13.8} schX={7.2} schY={-6.2} />
    <resistor name="R_USB_DM" resistance="27" footprint="0402" schSectionName="usb" pcbX={-1.2} pcbY={-12.4} schX={7.2} schY={-7.2} />
    <resistor name="R_USB_DP" resistance="27" footprint="0402" schSectionName="usb" pcbX={1.2} pcbY={-12.4} schX={7.2} schY={-8.2} />

    <capacitor name="C_VREG_IN" capacitance="4.7uF" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C23733"] }} schSectionName="power" schOrientation="vertical" pcbX={-4.5} pcbY={-6} schX={-4.8} schY={-3.4} />
    <capacitor name="C_CORE" capacitance="4.7uF" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C23733"] }} schSectionName="power" schOrientation="vertical" pcbX={9.5} pcbY={-7.2} schX={3.5} schY={-4.5} />
    <capacitor name="C_VREG_AVDD" capacitance="4.7uF" maxDecouplingTraceLength={5.5} footprint="0402" supplierPartNumbers={{ jlcpcb: ["C23733"] }} schSectionName="power" schOrientation="vertical" pcbX={2.8} pcbY={5.25} pcbRotation={90} schX={-6.45} schY={-2.4} />
    <capacitor name="C_IO" capacitance="100nF" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C1525"] }} schSectionName="power" schOrientation="vertical" pcbX={-5.5} pcbY={3.8} schX={-6.4} schY={2.8} />
    <capacitor name="C_QSPI_USB" capacitance="100nF" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C1525"] }} schSectionName="power" schOrientation="vertical" pcbX={5.6} pcbY={3.7} schX={6.01} schY={2.8} />
    <capacitor name="C_ADC" capacitance="100nF" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C1525"] }} schSectionName="power" schOrientation="vertical" pcbX={5.2} pcbY={5.6} schX={5.36} schY={3.8} />
    <capacitor name="C_FLASH" capacitance="100nF" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C1525"] }} schSectionName="flash" schOrientation="vertical" pcbX={8.2} pcbY={6.1} schX={9.4} schY={1.1} />
    <capacitor name="C_XIN" capacitance="18pF" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C1549"] }} schSectionName="clock" schOrientation="vertical" pcbX={-3} pcbY={10.8} schX={-7.3} schY={7.4} />
    <capacitor name="C_XOUT" capacitance="18pF" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C1549"] }} schSectionName="clock" schOrientation="vertical" pcbX={3} pcbY={10.8} schX={-5.7} schY={7.4} />
    <capacitor name="C_VBUS" capacitance="10uF" footprint="0603" schSectionName="usb" schOrientation="vertical" pcbX={-6.8} pcbY={-16} schX={15} schY={-5.2} />

    <testpoint name="TP_SWDIO" footprintVariant="pad" padShape="circle" padDiameter="1.1mm" schSectionName="debug" pcbX={-3} pcbY={-10} schX={-8.4} schY={-7.2} />
    <testpoint name="TP_SWCLK" footprintVariant="pad" padShape="circle" padDiameter="1.1mm" schSectionName="debug" pcbX={0} pcbY={-10} schX={-6.4} schY={-7.2} />
    <testpoint name="TP_GND" footprintVariant="pad" padShape="circle" padDiameter="1.1mm" schSectionName="debug" pcbX={3} pcbY={-10} schX={-4.4} schY={-7.2} />
    <testpoint name="TP_3V3" footprintVariant="pad" padShape="circle" padDiameter="1.1mm" schSectionName="debug" pcbX={6} pcbY={-10} schX={-2.4} schY={-7.2} />

    {/* Core regulator and digital supply */}
    <trace name="VREG_VIN" from=".U1 > .VREG_VIN" to="net.V3V3" {...v3v3Label} />
    <trace name="VREG_PGND" from=".U1 > .VREG_PGND" to="net.GND" {...gndLabel} />
    <trace name="VREG_LX" from=".U1 > .VREG_LX" to=".U_CORE_INDUCTOR > .pin1" />
    <trace name="CORE_OUT" from=".U_CORE_INDUCTOR > .pin2" to="net.V1V1" {...v1v1Label} />
    <trace name="VREG_FB" from=".U1 > .VREG_FB" to="net.V1V1" {...v1v1Label} />
    {dvddPins.map((pin) => (
      <Fragment key={pin}>
        <trace name={`${pin}_V1V1`} from={`.U1 > .${pin}`} to="net.V1V1" {...v1v1Label} />
      </Fragment>
    ))}
    <trace name="C_VREG_IN_P" from=".C_VREG_IN > .pin1" to="net.V3V3" {...v3v3Label} />
    <trace name="C_VREG_IN_G" from=".C_VREG_IN > .pin2" to="net.GND" {...gndLabel} />
    <trace name="C_CORE_P" from=".C_CORE > .pin1" to="net.V1V1" {...v1v1Label} />
    <trace name="C_CORE_G" from=".C_CORE > .pin2" to="net.GND" {...gndLabel} />
    <trace name="VREG_AVDD_FILTER" from="net.V3V3" to=".R_VREG_AVDD > .pin1" {...v3v3Label} />
    <trace name="VREG_AVDD" from=".R_VREG_AVDD > .pin2" to=".U1 > .VREG_AVDD" />
    <trace name="C_VREG_AVDD_P" from=".C_VREG_AVDD > .pin1" to=".U1 > .VREG_AVDD" />
    <trace
      name="C_VREG_AVDD_G"
      from=".C_VREG_AVDD > .pin2"
      to="net.GND"
      maxLength="8mm"
      {...gndLabel}
    />

    {/* I/O, QSPI, USB/OTP, and ADC supplies with local decoupling. */}
    {iovddPins.map((pin) => (
      <Fragment key={pin}>
        <trace name={`${pin}_V3V3`} from={`.U1 > .${pin}`} to="net.V3V3" {...v3v3Label} />
      </Fragment>
    ))}
    <trace name="QSPI_IOVDD" from=".U1 > .QSPI_IOVDD" to="net.V3V3" {...v3v3Label} />
    <trace name="USB_OTP_VDD" from=".U1 > .USB_OTP_VDD" to="net.V3V3" {...v3v3Label} />
    <trace name="ADC_AVDD" from=".U1 > .ADC_AVDD" to="net.V3V3" {...v3v3Label} />
    <trace name="C_IO_P" from=".C_IO > .pin1" to="net.V3V3" {...v3v3Label} />
    <trace name="C_IO_G" from=".C_IO > .pin2" to="net.GND" {...gndLabel} />
    <trace name="C_QSPI_USB_P" from=".C_QSPI_USB > .pin1" to="net.V3V3" {...v3v3Label} />
    <trace name="C_QSPI_USB_G" from=".C_QSPI_USB > .pin2" to="net.GND" {...gndLabel} />
    <trace name="C_ADC_P" from=".C_ADC > .pin1" to="net.V3V3" {...v3v3Label} />
    <trace name="C_ADC_G" from=".C_ADC > .pin2" to="net.GND" {...gndLabel} />
    <trace name="GND_PAD" from=".U1 > .GND" to="net.GND" {...gndLabel} />

    {/* QSPI boot flash follows the signal mapping used by the local Pico. */}
    <trace name="QSPI_SS" from=".U1 > .QSPI_SS" to=".U2 > .CS" {...denseTraceProps} />
    <trace name="QSPI_SD0" from=".U1 > .QSPI_SD0" to=".U2 > .pin5" {...denseTraceProps} />
    <trace name="QSPI_SD1" from=".U1 > .QSPI_SD1" to=".U2 > .pin2" {...denseTraceProps} />
    <trace name="QSPI_SD2" from=".U1 > .QSPI_SD2" to=".U2 > .pin3" {...denseTraceProps} />
    <trace name="QSPI_SD3" from=".U1 > .QSPI_SD3" to=".U2 > .pin7" {...denseTraceProps} />
    <trace name="QSPI_SCLK" from=".U1 > .QSPI_SCLK" to=".U2 > .CLK" {...denseTraceProps} />
    <trace name="FLASH_VCC" from=".U2 > .VCC" to="net.V3V3" {...v3v3Label} />
    <trace name="FLASH_GND" from=".U2 > .GND" to="net.GND" {...gndLabel} />
    <trace name="FLASH_EP" from=".U2 > .EP" to="net.GND" {...gndLabel} />
    <trace name="C_FLASH_P" from=".C_FLASH > .pin1" to="net.V3V3" {...v3v3Label} />
    <trace name="C_FLASH_G" from=".C_FLASH > .pin2" to="net.GND" {...gndLabel} />
    <trace name="BOOT_PULLUP" from=".R_BOOT > .pin1" to=".U1 > .QSPI_SS" />
    <trace name="BOOT_PULLUP_3V3" from=".R_BOOT > .pin2" to="net.V3V3" {...v3v3Label} />
    <trace name="BOOTSEL" from=".U_BOOTSEL > .pin1" to=".U1 > .QSPI_SS" />
    <trace name="BOOTSEL_GND" from=".U_BOOTSEL > .pin3" to="net.GND" {...gndLabel} />

    {/* Crystal, reset, USB-C, and SWD are available to the eventual board. */}
    <trace name="XIN" from=".U_XTAL > .OSC1" to=".U1 > .XIN" />
    <trace name="XOUT" from=".U_XTAL > .OSC2" to=".U1 > .XOUT" />
    <trace name="XTAL_GND1" from=".U_XTAL > .GND1" to="net.GND" {...gndLabel} />
    <trace name="XTAL_GND2" from=".U_XTAL > .GND2" to="net.GND" {...gndLabel} />
    <trace name="T_C_XIN" from=".C_XIN > .pin1" to=".U1 > .XIN" />
    <trace name="C_XIN_GND" from=".C_XIN > .pin2" to="net.GND" {...gndLabel} />
    <trace name="T_C_XOUT" from=".C_XOUT > .pin1" to=".U1 > .XOUT" />
    <trace name="C_XOUT_GND" from=".C_XOUT > .pin2" to="net.GND" {...gndLabel} />
    <trace name="RUN_PULLUP" from=".R_RUN > .pin1" to=".U1 > .RUN" />
    <trace name="RUN_PULLUP_3V3" from=".R_RUN > .pin2" to="net.V3V3" {...v3v3Label} />
    <trace name="RUN_SWITCH" from=".U_RUN > .pin1" to=".U1 > .RUN" />
    <trace name="RUN_SWITCH_GND" from=".U_RUN > .pin3" to="net.GND" {...gndLabel} />
    <trace name="VBUS_A" from=".J_USB > .A4B9" to="net.VBUS" {...vbusLabel} />
    <trace name="VBUS_B" from=".J_USB > .B4A9" to="net.VBUS" {...vbusLabel} />
    <trace name="C_VBUS_P" from=".C_VBUS > .pin1" to="net.VBUS" {...vbusLabel} />
    <trace name="C_VBUS_G" from=".C_VBUS > .pin2" to="net.GND" {...gndLabel} />
    <trace name="USB_DM_A" from=".J_USB > .A7" to=".R_USB_DM > .pin1" />
    <trace name="USB_DM_B" from=".J_USB > .B7" to=".R_USB_DM > .pin1" />
    <trace name="USB_DM" from=".R_USB_DM > .pin2" to=".U1 > .USB_DM" {...denseTraceProps} />
    <trace name="USB_DP_A" from=".J_USB > .A6" to=".R_USB_DP > .pin1" />
    <trace name="USB_DP_B" from=".J_USB > .B6" to=".R_USB_DP > .pin1" />
    <trace name="USB_DP" from=".R_USB_DP > .pin2" to=".U1 > .USB_DP" {...denseTraceProps} />
    <trace name="CC1" from=".J_USB > .A5" to=".R_CC1 > .pin1" />
    <trace name="CC2" from=".J_USB > .B5" to=".R_CC2 > .pin1" />
    <trace name="CC1_GND" from=".R_CC1 > .pin2" to="net.GND" {...gndLabel} />
    <trace name="CC2_GND" from=".R_CC2 > .pin2" to="net.GND" {...gndLabel} />
    <trace name="USB_GND_A" from=".J_USB > .A1B12" to="net.GND" {...gndLabel} />
    <trace name="USB_GND_B" from=".J_USB > .B1A12" to="net.GND" {...gndLabel} />
    <trace name="USB_SHIELD_1" from=".J_USB > .EH1" to="net.GND" {...gndLabel} />
    <trace name="USB_SHIELD_1_ALT" from=".J_USB > .pin13_alt1" to="net.GND" {...gndLabel} />
    <trace name="USB_SHIELD_2" from=".J_USB > .EH2" to="net.GND" {...gndLabel} />
    <trace name="USB_SHIELD_2_ALT" from=".J_USB > .pin14_alt1" to="net.GND" {...gndLabel} />
    <trace name="SWDIO" from=".U1 > .SWDIO" to=".TP_SWDIO > .pin1" />
    <trace name="SWCLK" from=".U1 > .SWCLK" to=".TP_SWCLK > .pin1" />
    <trace name="T_TP_GND" from=".TP_GND > .pin1" to="net.GND" {...gndLabel} />
    <trace name="T_TP_3V3" from=".TP_3V3 > .pin1" to="net.V3V3" {...v3v3Label} />

  </group>
)
