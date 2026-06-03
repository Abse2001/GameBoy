import { RP2040 } from "./imports/RP2040"
import { TYPE_C_16PIN_2MD_073_ } from "./imports/TYPE_C_16PIN_2MD_073_"
import { W25Q16JVUXIQ } from "./imports/W25Q16JVUXIQ"
import { AP2112K_3_3TRG1 } from "./imports/AP2112K_3_3TRG1"
import { X322512MSB4SI } from "./imports/X322512MSB4SI"
import { SKRPACE010 } from "./imports/SKRPACE010"

const leftHeaderPins = [
  "GP0",
  "GP1",
  "GND",
  "GP2",
  "GP3",
  "GP4",
  "GP5",
  "GND",
  "GP6",
  "GP7",
  "GP8",
  "GP9",
  "GND",
  "GP10",
  "GP11",
  "GP12",
  "GP13",
  "GND",
  "GP14",
  "GP15",
]

const rightHeaderPins = [
  "VBUS",
  "VSYS",
  "GND",
  "V3V3_EN",
  "V3V3",
  "ADC_VREF",
  "GP28_ADC2",
  "GND",
  "GP27_ADC1",
  "GP26_ADC0",
  "RUN_NC",
  "GP22",
  "GND",
  "GP21",
  "GP20",
  "GP19",
  "GP18",
  "GND",
  "GP17",
  "GP16",
]

const makeUniquePinLabels = (pins: string[]) =>
  pins.map((pin, index) => (pins.indexOf(pin) === index ? pin : `${pin}_${index + 1}`))

const makePcbPinLabels = (pins: string[]) =>
  Object.fromEntries(pins.map((pin, index) => [`pin${index + 1}`, pin]))

const leftHeaderPortLabels = makeUniquePinLabels(leftHeaderPins)
const rightHeaderPortLabels = makeUniquePinLabels(rightHeaderPins)
const leftHeaderPinLabels = makePcbPinLabels(leftHeaderPortLabels)
const rightHeaderPinLabels = makePcbPinLabels(rightHeaderPortLabels)
const denseTraceProps = { thickness: "0.1mm" } as const

const leftHeaderNetConnections = leftHeaderPortLabels
  .map((portName, index) => [portName, leftHeaderPins[index]])
  .filter(([, netName]) => netName === "GND")

const rightHeaderNetConnections = rightHeaderPortLabels
  .map((portName, index) => [portName, rightHeaderPins[index]])
  .filter(([, netName]) => ["VBUS", "VSYS", "GND", "V3V3_EN", "ADC_VREF", "RUN_NC"].includes(netName))

const headerSignalConnections = [
  ["U1", "GPIO0", "J_LEFT", "GP0"],
  ["U1", "GPIO1", "J_LEFT", "GP1"],
  ["U1", "GPIO2", "J_LEFT", "GP2"],
  ["U1", "GPIO3", "J_LEFT", "GP3"],
  ["U1", "GPIO4", "J_LEFT", "GP4"],
  ["U1", "GPIO5", "J_LEFT", "GP5"],
  ["U1", "GPIO6", "J_LEFT", "GP6"],
  ["U1", "GPIO7", "J_LEFT", "GP7"],
  ["U1", "GPIO8", "J_LEFT", "GP8"],
  ["U1", "GPIO9", "J_LEFT", "GP9"],
  ["U1", "GPIO10", "J_LEFT", "GP10"],
  ["U1", "GPIO11", "J_LEFT", "GP11"],
  ["U1", "GPIO12", "J_LEFT", "GP12"],
  ["U1", "GPIO13", "J_LEFT", "GP13"],
  ["U1", "GPIO14", "J_LEFT", "GP14"],
  ["U1", "GPIO15", "J_LEFT", "GP15"],
  ["U1", "GPIO16", "J_RIGHT", "GP16"],
  ["U1", "GPIO17", "J_RIGHT", "GP17"],
  ["U1", "GPIO18", "J_RIGHT", "GP18"],
  ["U1", "GPIO19", "J_RIGHT", "GP19"],
  ["U1", "GPIO20", "J_RIGHT", "GP20"],
  ["U1", "GPIO21", "J_RIGHT", "GP21"],
  ["U1", "GPIO22", "J_RIGHT", "GP22"],
  ["U1", "GPIO26_ADC0", "J_RIGHT", "GP26_ADC0"],
  ["U1", "GPIO27_ADC1", "J_RIGHT", "GP27_ADC1"],
  ["U1", "GPIO28_ADC2", "J_RIGHT", "GP28_ADC2"],
]

const rp2040Pins = {
  pin1: "IOVDD",
  pin2: "GP0",
  pin3: "GP1",
  pin4: "GP2",
  pin5: "GP3",
  pin6: "GP4",
  pin7: "IOVDD",
  pin8: "GP5",
  pin9: "GP6",
  pin10: "GP7",
  pin11: "GP8",
  pin12: "GP9",
  pin13: "GND",
  pin14: "GP10",
  pin15: "GP11",
  pin16: "GP12",
  pin17: "GP13",
  pin18: "GP14",
  pin19: "GP15",
  pin20: "TESTEN",
  pin21: "XIN",
  pin22: "XOUT",
  pin23: "IOVDD",
  pin24: "DVDD",
  pin25: "SWCLK",
  pin26: "SWDIO",
  pin27: "RUN",
  pin28: "GP16",
  pin29: "GP17",
  pin30: "GND",
  pin31: "GP18",
  pin32: "GP19",
  pin33: "GP20",
  pin34: "GP21",
  pin35: "IOVDD",
  pin36: "GP22",
  pin37: "GP23",
  pin38: "GP24",
  pin39: "GP25_LED",
  pin40: "GP26_ADC0",
  pin41: "GP27_ADC1",
  pin42: "GP28_ADC2",
  pin43: "ADC_AVDD",
  pin44: "VREG_VIN",
  pin45: "VREG_VOUT",
  pin46: "USB_DM",
  pin47: "USB_DP",
  pin48: "USB_VDD",
  pin49: "DVDD",
  pin50: "QSPI_SS",
  pin51: "QSPI_SD0",
  pin52: "QSPI_SD1",
  pin53: "QSPI_SD2",
  pin54: "QSPI_SD3",
  pin55: "QSPI_SCLK",
  pin56: "GND",
}

const rp2040HeaderNets = [
  "GP0",
  "GP1",
  "GP2",
  "GP3",
  "GP4",
  "GP5",
  "GP6",
  "GP7",
  "GP8",
  "GP9",
  "GP10",
  "GP11",
  "GP12",
  "GP13",
  "GP14",
  "GP15",
  "GP16",
  "GP17",
  "GP18",
  "GP19",
  "GP20",
  "GP21",
  "GP22",
  "GP26_ADC0",
  "GP27_ADC1",
  "GP28_ADC2",
  "RUN",
]

const flashConnections = [
  { rp2040Pin: "QSPI_SS", flashPin: "CS" },
  { rp2040Pin: "QSPI_SD0", flashPin: "pin5" },
  { rp2040Pin: "QSPI_SD1", flashPin: "pin2" },
  { rp2040Pin: "QSPI_SD2", flashPin: "pin3" },
  { rp2040Pin: "QSPI_SD3", flashPin: "pin7" },
  { rp2040Pin: "QSPI_SCLK", flashPin: "CLK" },
]

const powerPins = [
  ["IOVDD1", "V3V3"],
  ["IOVDD2", "V3V3"],
  ["IOVDD3", "V3V3"],
  ["IOVDD4", "V3V3"],
  ["IOVDD5", "V3V3"],
  ["IOVDD6", "V3V3"],
  ["DVDD1", "V1V1"],
  ["DVDD2", "V1V1"],
  ["VREG_IN", "V3V3"],
  ["VREG_VOUT", "V1V1"],
  ["USB_VDD", "V3V3"],
]

const groundPins = ["GND"]

const UsbCFootprint = () => (
  <footprint>
    <smtpad portHints={["VBUS"]} pcbX="-3.2mm" pcbY="-1.8mm" width="0.6mm" height="1.5mm" shape="rect" />
    <smtpad portHints={["D_NEG"]} pcbX="-1.05mm" pcbY="-1.8mm" width="0.5mm" height="1.5mm" shape="rect" />
    <smtpad portHints={["D_POS"]} pcbX="1.05mm" pcbY="-1.8mm" width="0.5mm" height="1.5mm" shape="rect" />
    <smtpad portHints={["GND"]} pcbX="3.2mm" pcbY="-1.8mm" width="0.6mm" height="1.5mm" shape="rect" />
    <smtpad portHints={["CC1"]} pcbX="-2.1mm" pcbY="-1.8mm" width="0.5mm" height="1.5mm" shape="rect" />
    <smtpad portHints={["CC2"]} pcbX="2.1mm" pcbY="-1.8mm" width="0.5mm" height="1.5mm" shape="rect" />
    <smtpad portHints={["SHIELD1"]} pcbX="-4.6mm" pcbY="0.8mm" width="1.8mm" height="2.4mm" shape="rect" />
    <smtpad portHints={["SHIELD2"]} pcbX="4.6mm" pcbY="0.8mm" width="1.8mm" height="2.4mm" shape="rect" />
  </footprint>
)

const SmallCrystalFootprint = () => (
  <footprint>
    <smtpad portHints={["pin1"]} pcbX="-1.25mm" pcbY="0mm" width="1.1mm" height="1.4mm" shape="rect" />
    <smtpad portHints={["pin2"]} pcbX="1.25mm" pcbY="0mm" width="1.1mm" height="1.4mm" shape="rect" />
  </footprint>
)

const PicoHeaderFootprint = ({ ports }: { ports: string[] }) => (
  <footprint insertionDirection="from_above">
    {ports.map((portName, index) => (
      <platedhole
        portHints={[portName]}
        pcbX="0mm"
        pcbY={`${(9.5 - index) * 2.54}mm`}
        shape="circle"
        holeDiameter="1mm"
        outerDiameter="1.7mm"
      />
    ))}
  </footprint>
)

const HeaderFanout = ({
  headerName,
  connections,
}: {
  headerName: string
  connections: string[][]
}) => (
  <>
    {connections.map(([portName, netName]) => (
      <trace key={`${headerName}-${portName}`} from={`.${headerName} > .${portName}`} to={`net.${netName}`} />
    ))}
  </>
)

export default () => (
  <board
    title="absePico RP2040-compatible development board"
    width="30mm"
    height="70mm"
    layers={2}
    minViaHoleDiameter="0.3mm"
    minViaPadDiameter="0.45mm"
    borderRadius="1.5mm"
  >
    <connector
      name="J_LEFT"
      manufacturerPartNumber="PICO-LEFT-20P"
      footprint={<PicoHeaderFootprint ports={leftHeaderPortLabels} />}
      pinLabels={leftHeaderPinLabels}
      pcbX={-12.5}
      pcbY={0}
    />
    <connector
      name="J_RIGHT"
      manufacturerPartNumber="PICO-RIGHT-20P"
      footprint={<PicoHeaderFootprint ports={rightHeaderPortLabels} />}
      pinLabels={rightHeaderPinLabels}
      pcbX={12.5}
      pcbY={0}
    />

    <TYPE_C_16PIN_2MD_073_
      name="J_USB"
      pcbX={0}
      pcbY={31.4}
      pcbRotation={180}
    />

    <RP2040
      name="U1"
      showPinAliases
      pcbX={3}
      pcbY={-8}
    />
    <W25Q16JVUXIQ
      name="U2"
      pcbX={8.5}
      pcbY={5.5}
      pcbRotation={90}
    />
    <AP2112K_3_3TRG1
      name="U3"
      pcbX={-8}
      pcbY={17}
      pcbRotation={0}
    />

    <X322512MSB4SI
      name="Y1"
      pcbX={-4}
      pcbY={-12}
    />
    <SKRPACE010 name="SW_BOOT" pcbX={7.5} pcbY={9} />
    <SKRPACE010 name="SW_RUN" pcbX={-6} pcbY={-25} pcbRotation={90} />
    <led name="D1" color="green" footprint="0603" pcbX={8} pcbY={-3} pcbRotation={270} />
    

    <resistor name="R_BOOT" resistance="10k" footprint="0402" pcbX={4.5} pcbY={5.5} pcbRotation={90} />
    <resistor name="R_LED" resistance="330" footprint="0402" pcbX={8} pcbY={1} />
    <resistor name="R_CC1" resistance="5.1k" footprint="0402" pcbX={-4} pcbY={24} />
    <resistor name="R_CC2" resistance="5.1k" footprint="0402" pcbX={4} pcbY={24} />
    <resistor name="R_USB1" resistance="27" footprint="0402" pcbX={2} pcbY={12} pcbRotation={90} />
    <resistor name="R_USB2" resistance="27" footprint="0402" pcbX={5} pcbY={12} pcbRotation={90} />

    <capacitor name="C_VBUS" capacitance="10uF" footprint="0603" pcbX={-9} pcbY={24} pcbRotation={90} />
    <capacitor name="C_3V3" capacitance="10uF" footprint="0603" pcbX={-2.5} pcbY={2.5} />
    <capacitor name="C_CORE" capacitance="1uF" footprint="0402" pcbX={-1.5} pcbY={-17} />
    <capacitor name="C_USB" capacitance="1uF" footprint="0402" pcbX={10} pcbY={12} />
    <capacitor name="C_XIN" capacitance="18pF" footprint="0402" pcbX={-8} pcbY={-9.5} />
    <capacitor name="C_XOUT" capacitance="18pF" footprint="0402" pcbX={-8} pcbY={-14.5} />
    <inductor name="L_AVDD" inductance="600ohm@100MHz" footprint="0603" pcbX={9.5} pcbY={-8} pcbRotation={90} />

    <testpoint name="TP_SWCLK" footprintVariant="pad" padShape="circle" padDiameter="1.1mm" pcbX={-6} pcbY={-31} />
    <testpoint name="TP_GND" footprintVariant="pad" padShape="circle" padDiameter="1.1mm" pcbX={-2} pcbY={-31} />
    <testpoint name="TP_SWDIO" footprintVariant="pad" padShape="circle" padDiameter="1.1mm" pcbX={2} pcbY={-31} />
    <testpoint name="TP_3V3" footprintVariant="pad" padShape="circle" padDiameter="1.1mm" pcbX={6} pcbY={-31} />

    <HeaderFanout headerName="J_LEFT" connections={leftHeaderNetConnections} />
    <HeaderFanout headerName="J_RIGHT" connections={rightHeaderNetConnections} />
    <trace from=".J_RIGHT > .V3V3" to=".C_USB > .pin1" />

    {headerSignalConnections.map(([chipName, chipPin, headerName, headerPin]) => (
      <trace
        {...denseTraceProps}
        from={`.${chipName} > .${chipPin}`}
        to={`.${headerName} > .${headerPin}`}
      />
    ))}
    {flashConnections.map(({ rp2040Pin, flashPin }) => (
      <trace
        {...denseTraceProps}
        from={`.U1 > .${rp2040Pin}`}
        to={`.U2 > .${flashPin}`}
      />
    ))}
    {powerPins.map(([pinName, netName]) => (
      <trace {...denseTraceProps} from={`.U1 > .${pinName}`} to={`net.${netName}`} />
    ))}
    {groundPins.map((pinName) => (
      <trace from={`.U1 > .${pinName}`} to="net.GND" />
    ))}
    <trace {...denseTraceProps} from=".U1 > .USB_VDD" to=".U1 > .IOVDD1" />
    <trace from=".J_USB > .A4B9" to="net.VBUS" />
    <trace from=".J_USB > .B4A9" to="net.VBUS" />
    <trace from=".J_USB > .A7" to=".R_USB1 > .pin1" />
    <trace {...denseTraceProps} from=".R_USB1 > .pin2" to=".U1 > .USB_DM" />
    <trace from=".J_USB > .A6" to=".R_USB2 > .pin1" />
    <trace {...denseTraceProps} from=".R_USB2 > .pin2" to=".U1 > .USB_DP" />
    <trace from=".J_USB > .A5" to=".R_CC1 > .pin1" />
    <trace from=".J_USB > .B5" to=".R_CC2 > .pin1" />
    <trace from=".J_USB > .A1B12" to="net.GND" />
    <trace from=".J_USB > .B1A12" to="net.GND" />
    <trace from=".J_USB > .EH1" to="net.GND" />
    <trace from=".J_USB > .EH2" to="net.GND" />
    <trace from=".J_USB > .pin13_alt1" to="net.GND" />
    <trace from=".J_USB > .pin14_alt1" to="net.GND" />
    <trace from=".R_CC1 > .pin2" to="net.GND" />
    <trace from=".R_CC2 > .pin2" to="net.GND" />

    <trace from="net.VBUS" to=".C_VBUS > .pin1" />
    <trace from=".C_VBUS > .pin2" to="net.GND" />
    <trace from="net.VBUS" to="net.VSYS" />
    <trace from="net.VSYS" to=".U3 > .VIN" />
    <trace from=".U3 > .EN" to="net.V3V3_EN" />
    <trace from=".U3 > .VOUT" to="net.V3V3" />
    <trace from=".U3 > .GND" to="net.GND" />
    <trace from=".C_3V3 > .pin1" to="net.V3V3" />
    <trace from=".C_3V3 > .pin2" to="net.GND" />
    <trace from=".C_CORE > .pin1" to="net.V1V1" />
    <trace from=".C_CORE > .pin2" to="net.GND" />
    <trace from=".C_USB > .pin1" to="net.V3V3" />
    <trace from=".C_USB > .pin2" to="net.GND" />
    <trace from=".L_AVDD > .pin1" to="net.V3V3" />
    <trace from=".L_AVDD > .pin2" to="net.ADC_VREF" />
    <trace from=".U1 > .ADC_AVDD" to="net.ADC_VREF" />
    <trace from=".U2 > .GND" to="net.GND" />
    <trace from=".U2 > .VCC" to="net.V3V3" />
    <trace from=".U2 > .EP" to="net.GND" />

    <trace from=".Y1 > .OSC1" to=".U1 > .XIN" />
    <trace from=".Y1 > .OSC2" to=".U1 > .XOUT" />
    <trace from=".C_XIN > .pin1" to=".Y1 > .OSC1" />
    <trace from=".C_XIN > .pin2" to="net.GND" />
    <trace from=".C_XOUT > .pin1" to=".Y1 > .OSC2" />
    <trace from=".C_XOUT > .pin2" to="net.GND" />

    <trace from=".SW_BOOT > .pin1" to=".U1 > .QSPI_SS" />
    <trace from=".SW_BOOT > .pin2" to="net.GND" />
    <trace from=".R_BOOT > .pin1" to=".U1 > .QSPI_SS" />
    <trace from=".R_BOOT > .pin2" to="net.V3V3" />
    <trace from=".SW_RUN > .pin1" to=".U1 > .RUN" />
    <trace from=".SW_RUN > .pin2" to="net.GND" />

    <trace from=".U1 > .GPIO25" to=".R_LED > .pin1" />
    <trace from=".R_LED > .pin2" to=".D1 > .pin1" />
    <trace from=".D1 > .pin2" to="net.GND" />

    <trace from=".U1 > .SWCLK" to=".TP_SWCLK > .pin1" />
    <trace from=".U1 > .SWD" to=".TP_SWDIO > .pin1" />
    <trace from=".TP_GND > .pin1" to="net.GND" />
    <trace from=".TP_3V3 > .pin1" to="net.V3V3" />


    <copperpour connectsTo="net.GND" layer="bottom" clearance="0.18mm" />

    <silkscreentext text="absePico" fontSize="2mm" pcbX={-10} pcbY={-33} pcbRotation={0} />
    <silkscreentext text="RP2040 C2040" fontSize="0.9mm" pcbX={8} pcbY={-33} />
    <silkscreentext text="BOOT" fontSize="0.8mm" pcbX={12} pcbY={14} />
    <silkscreentext text="RUN" fontSize="0.8mm" pcbX={-12} pcbY={-30} />
    <silkscreentext text="USB-C" fontSize="0.9mm" pcbX={0} pcbY={25} />
  </board>
)
