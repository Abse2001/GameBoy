
import { PicoGroup } from "./PicoGroup"
import { LCDWiki_2_8_SPI_ILI9341_MSP2807 } from "./imports/LCDWiki_2_8_SPI_ILI9341_MSP2807"
import { KH_6X6X15H_SMT_FS_D } from "./imports/KH_6X6X15H_SMT_FS_D"
import { SK_12E12_G5 } from "./imports/SK_12E12_G5"
import { S2B_PH_K_S_LF__SN_ } from "./imports/S2B_PH_K_S_LF__SN_"
import { SM02B_PASS_TBT_LF__SN_ } from "./imports/SM02B_PASS_TBT_LF__SN_"
import { PAM8403DR_H } from "./imports/PAM8403DR_H"
import { MT3608 } from "./imports/MT3608"
import { SS34 } from "./imports/SS34"
import { SMMS0630_220M } from "./imports/SMMS0630_220M"
import { CL10A106KP8NNNC } from "./imports/CL10A106KP8NNNC"
import { CL10A226MQ8NRNC } from "./imports/CL10A226MQ8NRNC"
import { FRC0603F1302TS } from "./imports/FRC0603F1302TS"
import { A_0603WAF9532T5E } from "./imports/A_0603WAF9532T5E"
import { A_0603WAF1003T5E } from "./imports/A_0603WAF1003T5E"
import { MMBT3904_RANGE_100_300_ } from "./imports/MMBT3904_RANGE_100_300_"
import { AO3401A } from "./imports/AO3401A"
import { BLM18PG121SN1D } from "./imports/BLM18PG121SN1D"
import { RK10J12E002L } from "./imports/RK10J12E002L"

const denseTraceProps = { thickness: "0.08mm" } as const
const batteryTraceProps = { thickness: "0.3mm" } as const
const powerTraceProps = { thickness: "0.4mm" } as const
const speakerTraceProps = { thickness: "0.25mm" } as const
const gndLabel = { displayName: "GND", schDisplayLabel: "GND" } as const
const v3v3Label = { displayName: "V3V3", schDisplayLabel: "V3V3" } as const
const vsysLabel = { displayName: "VSYS", schDisplayLabel: "VSYS" } as const
const vbusLabel = { displayName: "VBUS", schDisplayLabel: "VBUS" } as const
const speakerY = -14

const schSections = {
  rp2040: "rp2040",
  headers: "headers",
  usb: "usb",
  power: "power",
  flash: "flash",
  clock: "clock",
  controls: "controls",
  display: "display",
  audio: "audio",
  status: "status",
  debug: "debug",
} as const

export default () => (
  <board
    title="Abse GameBoy RP2040 handheld demo board"
    width="106mm"
    height="130mm"
    layers={2}
    minViaHoleDiameter="0.3mm"
    minViaPadDiameter="0.45mm"
    borderRadius="1.5mm"
  >
    <schematicrect schX={0} schY={-10} width={84} height={28} strokeWidth={0.08} color="#777777" />
    <schematictext text="Pico" schX={-40.6} schY={-22.4} fontSize={1.4} anchor="top_left" color="#333333" />
    <schematicrect schX={-27} schY={16} width={30} height={24} strokeWidth={0.08} color="#777777" />
    <schematictext text="Power" schX={-40.6} schY={5.6} fontSize={1.4} anchor="top_left" color="#333333" />
    <schematicrect schX={-2} schY={16} width={20} height={24} strokeWidth={0.08} color="#777777" />
    <schematictext text="Display" schX={-10.6} schY={5.6} fontSize={1.4} anchor="top_left" color="#333333" />
    <schematicrect schX={25} schY={16} width={34} height={24} strokeWidth={0.08} color="#777777" />
    <schematictext text="Audio" schX={9.4} schY={5.6} fontSize={1.4} anchor="top_left" color="#333333" />
    <schematicrect schX={-27} schY={40} width={30} height={24} strokeWidth={0.08} color="#777777" />
    <schematictext text="Controls" schX={-40.6} schY={29.6} fontSize={1.4} anchor="top_left" color="#333333" />

    <net name="GND" isGroundNet />
    <net name="V3V3" isPowerNet />
    <net name="VSYS" isPowerNet />

    <hole name="MH_TOP_LEFT" diameter="3.3mm" pcbX={-48} pcbY={-60} />
    <hole name="MH_TOP_RIGHT" diameter="3.3mm" pcbX={48} pcbY={-60} />
    <hole name="MH_BOTTOM_LEFT" diameter="3.3mm" pcbX={-48} pcbY={60} />
    <hole name="MH_BOTTOM_RIGHT" diameter="3.3mm" pcbX={48} pcbY={60} />


    <PicoGroup pcbRotation="90" pcbX={-18} pcbY={31} />



    <LCDWiki_2_8_SPI_ILI9341_MSP2807
      name="J_LCD"
      schSectionName={schSections.display}
      layer="top"
      pcbX={0}
      pcbY={28}
      schX={-2}
      schY={16}
    />

    <S2B_PH_K_S_LF__SN_
      name="J_BAT"
      schSectionName={schSections.power}
      pcbX={-13}
      pcbY={60}
      pcbRotation={90}
      schX={-39}
      schY={8}
    />
    <cutout
      name="BAT_CABLE_SLOT_STRAIGHT"
      shape="rect"
      width="5mm"
      height="8mm"
      pcbX="-32mm"
      pcbY="61mm"
    />
    <cutout
      name="BAT_CABLE_SLOT_ROUND"
      shape="circle"
      radius="2.5mm"
      pcbX="-32mm"
      pcbY="57mm"
    />
    <SK_12E12_G5
      name="J_PWR_SW"
      schSectionName={schSections.power}
      pcbX={49.7}
      pcbY={8}
      pcbRotation={0}
      schX={-33}
      schY={8}
      schHeight={0.6}
    />
    <MT3608
      name="U_BAT_BOOST"
      schSectionName={schSections.power}
      pcbX={25}
      pcbY={56}
      pcbRotation={0}
      schX={-28}
      schY={11}
    />
    <SMMS0630_220M
      name="L_BAT_BOOST"
      schSectionName={schSections.power}
      pcbX={16}
      pcbY={56}
      pcbRotation={0}
      schX={-39}
      schY={11}
    />
    <SS34
      name="D_BAT_BOOST"
      schSectionName={schSections.power}
      pcbX={34}
      pcbY={56}
      pcbRotation={0}
      schX={-18}
      schY={11}
    />
    <CL10A106KP8NNNC
      name="C_BAT_IN"
      schSectionName={schSections.power}
      pcbX={22}
      pcbY={61}
      pcbRotation={90}
      schX={-39}
      schY={15}
    />
    <CL10A226MQ8NRNC
      name="C_BAT_OUT"
      schSectionName={schSections.power}
      pcbX={39}
      pcbY={56}
      pcbRotation={90}
      schX={-18}
      schY={15}
    />
    <CL10A106KP8NNNC
      name="C_BAT_IN_BULK"
      schSectionName={schSections.power}
      pcbX={16}
      pcbY={61.5}
      pcbRotation={90}
      schX={-39}
      schY={18}
    />
    <CL10A226MQ8NRNC
      name="C_BAT_OUT_BULK"
      schSectionName={schSections.power}
      pcbX={42}
      pcbY={56}
      pcbRotation={90}
      schX={-18}
      schY={18}
    />
    <A_0603WAF9532T5E
      name="R_BOOST_TOP"
      schSectionName={schSections.power}
      pcbX={30}
      pcbY={61}
      pcbRotation={90}
      schX={-23}
      schY={15}
    />
    <FRC0603F1302TS
      name="R_BOOST_BOT"
      schSectionName={schSections.power}
      pcbX={27}
      pcbY={61}
      pcbRotation={90}
      schX={-28}
      schY={18}
    />
    <A_0603WAF1003T5E
      name="R_BOOST_EN_PULLUP"
      schSectionName={schSections.power}
      pcbX={35}
      pcbY={61}
      pcbRotation={90}
      schX={-33}
      schY={16}
    />
    <A_0603WAF1003T5E
      name="R_USB_BOOST_OFF"
      schSectionName={schSections.power}
      pcbX={43}
      pcbY={61}
      pcbRotation={90}
      schX={-36}
      schY={23}
    />
    <A_0603WAF1003T5E
      name="R_USB_BOOST_OFF_PULLDOWN"
      schSectionName={schSections.power}
      pcbX={50}
      pcbY={53}
      pcbRotation={90}
      schX={-31}
      schY={23}
    />
    <AO3401A
      name="Q_BAT_CUTOFF"
      schSectionName={schSections.power}
      pcbX={7}
      pcbY={56}
      pcbRotation={0}
      schX={-33}
      schY={12.5}
      schHeight={0.4}
    />
    <A_0603WAF1003T5E
      name="R_BAT_GATE_PULLUP"
      schSectionName={schSections.power}
      pcbX={7}
      pcbY={61}
      pcbRotation={90}
      schX={-36}
      schY={14.5}
    />
    <A_0603WAF1003T5E
      name="R_BAT_GATE_BASE"
      schSectionName={schSections.power}
      pcbX={4}
      pcbY={61}
      pcbRotation={90}
      schX={-28}
      schY={15.5}
    />
    <MMBT3904_RANGE_100_300_
      name="Q_BAT_GATE"
      schSectionName={schSections.power}
      pcbX={1}
      pcbY={61}
      pcbRotation={0}
      schX={-31}
      schY={14}
      schHeight={0.4}
    />
    <MMBT3904_RANGE_100_300_
      name="Q_USB_BOOST_OFF"
      schSectionName={schSections.power}
      pcbX={47}
      pcbY={53}
      pcbRotation={0}
      schX={-24}
      schY={23}
      schHeight={0.4}
    />
    <KH_6X6X15H_SMT_FS_D name="SW_UP" schSectionName={schSections.controls} pcbX={-28} pcbY={-27} schX={-36} schY={31} />
    <KH_6X6X15H_SMT_FS_D name="SW_DOWN" schSectionName={schSections.controls} pcbX={-28} pcbY={-45} schX={-36} schY={34} />
    <KH_6X6X15H_SMT_FS_D name="SW_LEFT" schSectionName={schSections.controls} pcbX={-37} pcbY={-36} schX={-36} schY={37} />
    <KH_6X6X15H_SMT_FS_D name="SW_RIGHT" schSectionName={schSections.controls} pcbX={-19} pcbY={-36} schX={-36} schY={40} />
    <KH_6X6X15H_SMT_FS_D name="SW_A" schSectionName={schSections.controls} pcbX={37} pcbY={-36} schX={-27} schY={31} />
    <KH_6X6X15H_SMT_FS_D name="SW_B" schSectionName={schSections.controls} pcbX={28} pcbY={-45} schX={-27} schY={34} />
    <KH_6X6X15H_SMT_FS_D name="SW_X" schSectionName={schSections.controls} pcbX={28} pcbY={-27} schX={-27} schY={37} />
    <KH_6X6X15H_SMT_FS_D name="SW_Y" schSectionName={schSections.controls} pcbX={19} pcbY={-36} schX={-27} schY={40} />
    <KH_6X6X15H_SMT_FS_D name="SW_SELECT" schSectionName={schSections.controls} pcbX={-7} pcbY={-56} schX={-31.5} schY={43} />
    <KH_6X6X15H_SMT_FS_D name="SW_START" schSectionName={schSections.controls} pcbX={8} pcbY={-56} schX={-27} schY={43} />
    <SM02B_PASS_TBT_LF__SN_
      name="J_SPK"
      schSectionName={schSections.audio}
      pcbX={0}
      pcbY={0}
      pcbRotation={0}
      schX={17}
      schY={8}
    />
    <PAM8403DR_H
      name="U_SPK_AMP"
      schSectionName={schSections.audio}
      pcbX={0}
      pcbY={-25}
      pcbRotation={-90}
      schX={24.49}
      schY={14}
      schWidth={2.4}
      schHeight={1.8}
    />
    <resistor
      name="R_AMP_IN"
      schSectionName={schSections.audio}
      resistance="1k"
      footprint="0402"
      pcbX={-10}
      pcbY={-20}
      pcbRotation={-90}
      schX={18}
      schY={14}
    />
    <capacitor
      name="C_AMP_PWM_FILTER"
      schSectionName={schSections.audio}
      capacitance="10nF"
      footprint="0402"
      schOrientation="vertical"
      pcbX={-6}
      pcbY={-20}
      pcbRotation={90}
      schX={17.68}
      schY={17}
    />
    <capacitor
      name="C_AMP_IN_COUPLE"
      schSectionName={schSections.audio}
      capacitance="1uF"
      footprint="0402"
      schOrientation="vertical"
      pcbX={-7}
      pcbY={-16}
      pcbRotation={0}
      schX={20.51}
      schY={14}
    />
    <RK10J12E002L
      name="RV_VOLUME"
      schSectionName={schSections.audio}
      pcbX={-46.4}
      pcbY={-8}
      pcbRotation={90}
      schX={20.95}
      schY={17}
      schHeight={0.8}
    />
    <capacitor
      name="C_AMP_VDD"
      schSectionName={schSections.audio}
      capacitance="1uF"
      footprint="0402"
      schOrientation="vertical"
      pcbX={5}
      pcbY={-25}
      pcbRotation={-90}
      schX={27.83}
      schY={10}
    />
    <capacitor
      name="C_AMP_VDD_BULK"
      schSectionName={schSections.audio}
      capacitance="22uF"
      footprint="0603"
      schOrientation="vertical"
      pcbX={15}
      pcbY={-31}
      pcbRotation={-90}
      schX={30}
      schY={10}
    />
    <capacitor
      name="C_AMP_VREF"
      schSectionName={schSections.audio}
      capacitance="1uF"
      footprint="0402"
      schOrientation="vertical"
      pcbX={-6}
      pcbY={-25}
      pcbRotation={90}
      schX={21}
      schY={11}
    />
    <BLM18PG121SN1D
      name="FB_SPK_POS"
      schSectionName={schSections.audio}
      pcbX={-4}
      pcbY={-9}
      pcbRotation={90}
      schX={27.83}
      schY={16}
    />
    <BLM18PG121SN1D
      name="FB_SPK_NEG"
      schSectionName={schSections.audio}
      pcbX={4}
      pcbY={-9}
      pcbRotation={90}
      schX={28}
      schY={18}
    />
    <capacitor
      name="C_SPK_EMI_POS"
      schSectionName={schSections.audio}
      capacitance="220pF"
      footprint="0402"
      schOrientation="vertical"
      pcbX={-7}
      pcbY={-5}
      pcbRotation={90}
      schX={31.34}
      schY={16}
    />
    <capacitor
      name="C_SPK_EMI_NEG"
      schSectionName={schSections.audio}
      capacitance="220pF"
      footprint="0402"
      schOrientation="vertical"
      pcbX={7}
      pcbY={-5}
      pcbRotation={90}
      schX={30.83}
      schY={18}
    />

    <trace name="UP" from=".SW_UP > .pin1" to=".PICO .U1 > .GPIO2" />
    <trace name="UP_G" from=".SW_UP > .pin4" to="net.GND" {...gndLabel} />
    <trace name="DN" from=".SW_DOWN > .pin1" to=".PICO .U1 > .GPIO3" />
    <trace name="DN_G" from=".SW_DOWN > .pin4" to="net.GND" {...gndLabel} />
    <trace name="LFT" from=".SW_LEFT > .pin1" to=".PICO .U1 > .GPIO4" />
    <trace name="LFT_G" from=".SW_LEFT > .pin4" to="net.GND" {...gndLabel} />
    <trace name="RGT" from=".SW_RIGHT > .pin1" to=".PICO .U1 > .GPIO5" />
    <trace name="RGT_G" from=".SW_RIGHT > .pin4" to="net.GND" {...gndLabel} />
    <trace name="A" from=".SW_A > .pin1" to=".PICO .U1 > .GPIO6" />
    <trace name="A_G" from=".SW_A > .pin4" to="net.GND" {...gndLabel} />
    <trace name="B" from=".SW_B > .pin1" to=".PICO .U1 > .GPIO7" />
    <trace name="B_G" from=".SW_B > .pin4" to="net.GND" {...gndLabel} />
    <trace name="X" from=".SW_X > .pin1" to=".PICO .U1 > .GPIO8" />
    <trace name="X_G" from=".SW_X > .pin4" to="net.GND" {...gndLabel} />
    <trace name="Y" from=".SW_Y > .pin1" to=".PICO .U1 > .GPIO9" />
    <trace name="Y_G" from=".SW_Y > .pin4" to="net.GND" {...gndLabel} />
    <trace name="SEL" from=".SW_SELECT > .pin1" to=".PICO .U1 > .GPIO10" />
    <trace name="SEL_G" from=".SW_SELECT > .pin4" to="net.GND" {...gndLabel} />
    <trace name="STA" from=".SW_START > .pin1" to=".PICO .U1 > .GPIO11" />
    <trace name="STA_G" from=".SW_START > .pin4" to="net.GND" {...gndLabel} />

    <trace name="LCD_VCC" from=".J_LCD .J_HEADER > .VCC" to="net.VSYS" {...powerTraceProps} {...vsysLabel} />
    <trace name="LCD_GND" from=".J_LCD .J_HEADER > .GND" to="net.GND" {...gndLabel} />
    <trace name="LCD_CS" from=".J_LCD .J_HEADER > .CS" to=".PICO .U1 > .GPIO17" />
    <trace name="LCD_RST" from=".J_LCD .J_HEADER > .RESET" to=".PICO .U1 > .GPIO21" />
    <trace name="LCD_DC" from=".J_LCD .J_HEADER > .DC_RS" to=".PICO .U1 > .GPIO20" />
    <trace name="LCD_MOSI" from=".J_LCD .J_HEADER > .SDI_MOSI" to=".PICO .U1 > .GPIO19" />
    <trace name="LCD_SCK" from=".J_LCD .J_HEADER > .SCK" to=".PICO .U1 > .GPIO18" />
    <trace name="LCD_LED" from=".J_LCD .J_HEADER > .LED" to="net.V3V3" {...v3v3Label} />
    <trace name="LCD_MISO" from=".J_LCD .J_HEADER > .SDO_MISO" to=".PICO .U1 > .GPIO16" />
    <trace name="SPK_PWM" from=".PICO .U1 > .GPIO12" to=".R_AMP_IN > .pin1" {...denseTraceProps} />
    <trace name="AMP_PWM_FILTER" from=".R_AMP_IN > .pin2" to=".C_AMP_PWM_FILTER > .pin1" {...denseTraceProps} />
    <trace name="AMP_PWM_FILTER_G" from=".C_AMP_PWM_FILTER > .pin2" to="net.GND" {...denseTraceProps} {...gndLabel} />
    <trace name="VOL_IN" from=".R_AMP_IN > .pin2" to=".RV_VOLUME > .pin3" {...denseTraceProps} />
    <trace name="VOL_WIPER" from=".RV_VOLUME > .pin2" to=".C_AMP_IN_COUPLE > .pin1" {...denseTraceProps} />
    <trace name="VOL_GND" from=".RV_VOLUME > .pin1" to="net.GND" {...denseTraceProps} {...gndLabel} />
    <trace name="AMP_IN_L" from=".C_AMP_IN_COUPLE > .pin2" to=".U_SPK_AMP > .INL" {...denseTraceProps} />
    <trace name="AMP_IN_R_GND" from=".U_SPK_AMP > .INR" to="net.GND" {...denseTraceProps} {...gndLabel} />
    <trace name="AMP_MUTE" from=".U_SPK_AMP > .MUTE" to="net.V3V3" {...denseTraceProps} {...v3v3Label} />
    <trace name="AMP_SHUTDOWN" from=".U_SPK_AMP > .SHND" to="net.V3V3" {...denseTraceProps} {...v3v3Label} />
    <trace name="AMP_VDD" from=".U_SPK_AMP > .VDD" to="net.VSYS" {...powerTraceProps} {...vsysLabel} />
    <trace name="AMP_PVDD_L" from=".U_SPK_AMP > .PVDD1" to="net.VSYS" {...powerTraceProps} {...vsysLabel} />
    <trace name="AMP_PVDD_R" from=".U_SPK_AMP > .PVDD2" to="net.VSYS" {...powerTraceProps} {...vsysLabel} />
    <trace name="AMP_GND" from=".U_SPK_AMP > .GND" to="net.GND" {...powerTraceProps} {...gndLabel} />
    <trace name="AMP_PGND_L" from=".U_SPK_AMP > .PGND1" to="net.GND" {...powerTraceProps} {...gndLabel} />
    <trace name="AMP_PGND_R" from=".U_SPK_AMP > .PGND2" to="net.GND" {...powerTraceProps} {...gndLabel} />
    <trace name="AMP_DECOUPLE_VDD" from=".C_AMP_VDD > .pin1" to="net.VSYS" {...powerTraceProps} {...vsysLabel} />
    <trace name="AMP_DECOUPLE_GND" from=".C_AMP_VDD > .pin2" to="net.GND" {...powerTraceProps} {...gndLabel} />
    <trace name="AMP_BULK_VDD" from=".C_AMP_VDD_BULK > .pin1" to="net.VSYS" {...powerTraceProps} {...vsysLabel} />
    <trace name="AMP_BULK_GND" from=".C_AMP_VDD_BULK > .pin2" to="net.GND" {...powerTraceProps} {...gndLabel} />
    <trace name="AMP_VREF" from=".U_SPK_AMP > .VREF" to=".C_AMP_VREF > .pin1" {...denseTraceProps} />
    <trace name="AMP_VREF_GND" from=".C_AMP_VREF > .pin2" to="net.GND" {...denseTraceProps} {...gndLabel} />
    <trace name="AMP_OUT_POS_RAW" from=".U_SPK_AMP > .OUT_L_POS" to=".FB_SPK_POS > .pin1" {...speakerTraceProps} />
    <trace name="AMP_OUT_POS_FILT" from=".FB_SPK_POS > .pin2" to=".J_SPK > .pin1" {...speakerTraceProps} />
    <trace name="AMP_OUT_POS_EMI" from=".FB_SPK_POS > .pin2" to=".C_SPK_EMI_POS > .pin1" {...speakerTraceProps} />
    <trace name="SPK_EMI_POS_G" from=".C_SPK_EMI_POS > .pin2" to="net.GND" {...denseTraceProps} {...gndLabel} />
    <trace name="AMP_OUT_NEG_RAW" from=".U_SPK_AMP > .OUT_L_NEG" to=".FB_SPK_NEG > .pin1" {...speakerTraceProps} />
    <trace name="AMP_OUT_NEG_FILT" from=".FB_SPK_NEG > .pin2" to=".J_SPK > .pin2" {...speakerTraceProps} />
    <trace name="AMP_OUT_NEG_EMI" from=".FB_SPK_NEG > .pin2" to=".C_SPK_EMI_NEG > .pin1" {...speakerTraceProps} />
    <trace name="SPK_EMI_NEG_G" from=".C_SPK_EMI_NEG > .pin2" to="net.GND" {...denseTraceProps} {...gndLabel} />
    <trace name="SPK_SHIELD_L" from=".J_SPK > .pin3" to="net.GND" {...denseTraceProps} {...gndLabel} />
    <trace name="SPK_SHIELD_R" from=".J_SPK > .pin4" to="net.GND" {...denseTraceProps} {...gndLabel} />

    <trace name="BAT+" from=".J_BAT > .pin1" to=".J_PWR_SW > .pin2" {...batteryTraceProps} />
    <trace name="BAT_SW" from=".J_PWR_SW > .pin1" to=".Q_BAT_CUTOFF > .S" {...powerTraceProps} />
    <trace name="BOOST_EN_PULLUP_IN" from=".J_PWR_SW > .pin1" to=".R_BOOST_EN_PULLUP > .pin1" />
    <trace name="BOOST_EN" from=".R_BOOST_EN_PULLUP > .pin2" to=".U_BAT_BOOST > .EN" />
    <trace name="BOOST_EN_OFF_C" from=".Q_USB_BOOST_OFF > .C" to=".U_BAT_BOOST > .EN" />
    <trace name="BOOST_EN_OFF_E" from=".Q_USB_BOOST_OFF > .E" to="net.GND" {...gndLabel} />
    <trace name="USB_BOOST_OFF_R" from="net.VBUS" to=".R_USB_BOOST_OFF > .pin1" {...vbusLabel} />
    <trace name="USB_BOOST_OFF_B" from=".R_USB_BOOST_OFF > .pin2" to=".Q_USB_BOOST_OFF > .B" />
    <trace name="USB_BOOST_OFF_B_PD" from=".Q_USB_BOOST_OFF > .B" to=".R_USB_BOOST_OFF_PULLDOWN > .pin1" />
    <trace name="USB_BOOST_OFF_PD_G" from=".R_USB_BOOST_OFF_PULLDOWN > .pin2" to="net.GND" {...gndLabel} />
    <trace name="BAT_CUTOFF_OUT" from=".Q_BAT_CUTOFF > .D" to=".U_BAT_BOOST > .IN" {...powerTraceProps} />
    <trace name="BAT_GATE_PULLUP_IN" from=".J_PWR_SW > .pin1" to=".R_BAT_GATE_PULLUP > .pin1" />
    <trace name="BAT_GATE_PULLUP" from=".R_BAT_GATE_PULLUP > .pin2" to=".Q_BAT_CUTOFF > .G" />
    <trace name="BAT_GATE_PULLDOWN" from=".Q_BAT_GATE > .C" to=".Q_BAT_CUTOFF > .G" />
    <trace name="BAT_GATE_G" from=".Q_BAT_GATE > .E" to="net.GND" {...gndLabel} />
    <trace name="BAT_GATE_BASE_R" from=".U_BAT_BOOST > .EN" to=".R_BAT_GATE_BASE > .pin1" />
    <trace name="BAT_GATE_BASE" from=".R_BAT_GATE_BASE > .pin2" to=".Q_BAT_GATE > .B" />
    <trace name="BOOST_L_IN" from=".Q_BAT_CUTOFF > .D" to=".L_BAT_BOOST > .pin1" {...powerTraceProps} />
    <trace name="BOOST_L_SW" from=".L_BAT_BOOST > .pin2" to=".U_BAT_BOOST > .SW" {...powerTraceProps} />
    <trace name="BOOST_D_SW" from=".U_BAT_BOOST > .SW" to=".D_BAT_BOOST > .anode" {...powerTraceProps} />
    <trace name="BOOST_VSYS" from=".D_BAT_BOOST > .cathode" to="net.VSYS" {...powerTraceProps} {...vsysLabel} />
    <trace name="BOOST_G" from=".U_BAT_BOOST > .GND" to="net.GND" {...powerTraceProps} {...gndLabel} />
    <trace name="BOOST_IN_CAP" from=".C_BAT_IN > .pin1" to=".Q_BAT_CUTOFF > .D" {...powerTraceProps} />
    <trace name="BOOST_IN_CAP_G" from=".C_BAT_IN > .pin2" to="net.GND" {...powerTraceProps} {...gndLabel} />
    <trace name="BOOST_IN_BULK" from=".C_BAT_IN_BULK > .pin1" to=".Q_BAT_CUTOFF > .D" {...powerTraceProps} />
    <trace name="BOOST_IN_BULK_G" from=".C_BAT_IN_BULK > .pin2" to="net.GND" {...powerTraceProps} {...gndLabel} />
    <trace name="BOOST_OUT_CAP" from=".C_BAT_OUT > .pin1" to=".D_BAT_BOOST > .cathode" {...powerTraceProps} />
    <trace name="BOOST_OUT_CAP_G" from=".C_BAT_OUT > .pin2" to="net.GND" {...powerTraceProps} {...gndLabel} />
    <trace name="BOOST_OUT_BULK" from=".C_BAT_OUT_BULK > .pin1" to=".D_BAT_BOOST > .cathode" {...powerTraceProps} />
    <trace name="BOOST_OUT_BULK_G" from=".C_BAT_OUT_BULK > .pin2" to="net.GND" {...powerTraceProps} {...gndLabel} />
    <trace name="BOOST_FB_TOP" from=".D_BAT_BOOST > .cathode" to=".R_BOOST_TOP > .pin1" />
    <trace name="BOOST_FB" from=".R_BOOST_TOP > .pin2" to=".U_BAT_BOOST > .FB" />
    <trace name="BOOST_FB_BOT" from=".U_BAT_BOOST > .FB" to=".R_BOOST_BOT > .pin1" />
    <trace name="BOOST_FB_G" from=".R_BOOST_BOT > .pin2" to="net.GND" {...gndLabel} />
    <trace name="BAT_G" from=".J_BAT > .pin2" to="net.GND" {...gndLabel} />
    <trace name="SW_G" from=".J_PWR_SW > .pin4" to="net.GND" {...gndLabel} />
    <trace name="SW_G2" from=".J_PWR_SW > .pin5" to="net.GND" {...gndLabel} />
    <copperpour
      name="GND_POUR_TOP"
      connectsTo="net.GND"
      layer="top"
      clearance="0.18mm"
      boardEdgeMargin="0.25mm"
    />
    <copperpour
      name="GND_POUR_BOTTOM"
      connectsTo="net.GND"
      layer="bottom"
      clearance="0.18mm"
      boardEdgeMargin="0.25mm"
    />

    <silkscreentext text="LCDWIKI 2.8 SPI" fontSize="1.2mm" pcbX={0} pcbY={54} />
    <silkscreentext text="BAT" fontSize="0.9mm" pcbX={-40} pcbY={55} pcbRotation={90} />
    <silkscreentext text="USB PRIMARY / 3xAA" fontSize="0.9mm" pcbX={26} pcbY={50} />
    <silkscreentext text="PWR SW" fontSize="0.9mm" pcbX={46} pcbY={20} pcbRotation={90} />
    <silkscreentext text="UP" fontSize="0.9mm" pcbX={-28} pcbY={-23} />
    <silkscreentext text="DOWN" fontSize="0.9mm" pcbX={-28} pcbY={-41} />
    <silkscreentext text="LEFT" fontSize="0.9mm" pcbX={-37} pcbY={-32} />
    <silkscreentext text="RIGHT" fontSize="0.9mm" pcbX={-19} pcbY={-32} />
    <silkscreentext text="A" fontSize="0.9mm" pcbX={37} pcbY={-32} />
    <silkscreentext text="B" fontSize="0.9mm" pcbX={28} pcbY={-41} />
    <silkscreentext text="X" fontSize="0.9mm" pcbX={28} pcbY={-23} />
    <silkscreentext text="Y" fontSize="0.9mm" pcbX={19} pcbY={-32} />
    <silkscreentext text="SELECT" fontSize="0.9mm" pcbX={-7} pcbY={-52} />
    <silkscreentext text="START" fontSize="0.9mm" pcbX={8} pcbY={-52} />
    <silkscreentext text="SPK" fontSize="0.9mm" pcbX={0} pcbY={-2} />
  </board>
)
