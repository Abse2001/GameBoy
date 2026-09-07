// GBA placement variant of @tscircuit/common's PAM8403 circuit.
// The default electrical topology and values are unchanged. The optional
// volume wheel is AC-coupled on both sides. No manual PCB routes.
import type { GroupProps } from "@tscircuit/props"
import { BLM18PG121SN1D } from "../../imports/BLM18PG121SN1D"
import { PAM8403DR_H } from "../../imports/PAM8403DR_H"
import { SM02B_PASS_TBT_LF__SN_ } from "./SM02B_PASS_TBT_LF__SN_"
import { RK10J12E002L } from "./imports/RK10J12E002L"
import { CL10A105KB8NNNC } from "./imports/CL10A105KB8NNNC/CL10A105KB8NNNC"

const signalTraceProps = { thickness: "0.1mm" } as const
const powerTraceProps = { thickness: "0.4mm" } as const
const speakerTraceProps = { thickness: "0.25mm" } as const
const gndLabel = { displayName: "GND", schDisplayLabel: "GND" } as const
const v3v3Label = { displayName: "V3V3", schDisplayLabel: "V3V3" } as const
const vsysLabel = { displayName: "VSYS", schDisplayLabel: "VSYS" } as const

const schSections = {
  input: "audio-input",
  amplifier: "audio-amplifier",
  output: "speaker-output",
} as const

export type AudioAmplifier3WPAM8403Props = Omit<GroupProps, "children" | "subcircuit"> & {
  speakerConnectorPlacement?: { pcbX: number; pcbY: number; pcbRotation: number }
  vrefPlacement?: { pcbX: number; pcbY: number; pcbRotation: number }
  volumeControl?: {
    wheelPlacement: { pcbX: number; pcbY: number; pcbRotation: number }
    inputCapPlacement: { pcbX: number; pcbY: number; pcbRotation: number }
  }
  placements?: Partial<Record<"R_AMP_IN" | "C_AMP_PWM_FILTER" | "C_AMP_IN_COUPLE" | "C_AMP_VDD" | "C_AMP_VDD_BULK" | "FB_SPK_POS", { pcbX: number; pcbY: number; pcbRotation: number }>>
}

/**
 * 3W mono PWM audio amplifier extracted from abse/gameboy.
 *
 * The circuit includes PWM input filtering, PAM8403 amplification, power
 * decoupling, speaker EMI filtering, and the speaker connector. Its ordinary
 * group shares the board's routing scope; it does not route separately.
 */
export const AudioAmplifier_GlobalLayout = ({
  name = "AudioAmplifier_GlobalLayout",
  vrefPlacement,
  placements,
  volumeControl,
  speakerConnectorPlacement,
  ...props
}: AudioAmplifier3WPAM8403Props) => (
  <group
    minViaHoleDiameter="0.3mm"
    minViaPadDiameter="0.45mm"
    {...props}
    name={name}
  >
    <net name="AUDIO_PWM" />
    <net name="V3V3" isPowerNet />
    <net name="VSYS" isPowerNet />
    <net name="GND" isGroundNet />

    <schematicsection name={schSections.input} displayName="PWM Input Filter" />
    <schematicsection
      name={schSections.amplifier}
      displayName="PAM8403 Amplifier"
    />
    <schematicsection
      name={schSections.output}
      displayName="Speaker Output Filter"
    />

    <resistor
      name="R_AMP_IN"
      supplierPartNumbers={{ jlcpcb: ["C11702"] }}
      manufacturerPartNumber="0402WGF1001TCE"
      tolerance="1%"
      schSectionName={schSections.input}
      resistance="1k"
      footprint="0402"
      pcbX={6}
      pcbY={0}
      pcbRotation={-90}
      schX={-8}
      schY={3}
      {...placements?.R_AMP_IN}
    />
    <capacitor
      name="C_AMP_PWM_FILTER"
      supplierPartNumbers={{ jlcpcb: ["C15195"] }}
      manufacturerPartNumber="CL05B103KB5NNNC"
      maxVoltageRating="50V"
      schSectionName={schSections.input}
      capacitance="10nF"
      footprint="0402"
      schOrientation="vertical"
      pcbX={10}
      pcbY={0}
      pcbRotation={90}
      schX={-6}
      schY={0}
      {...placements?.C_AMP_PWM_FILTER}
    />
    <capacitor
      name="C_AMP_IN_COUPLE"
      supplierPartNumbers={{ jlcpcb: ["C52923"] }}
      manufacturerPartNumber="CL05A105KA5NQNC"
      maxVoltageRating="25V"
      schSectionName={schSections.input}
      capacitance="1uF"
      footprint="0402"
      schOrientation="vertical"
      pcbX={9}
      pcbY={4}
      schX={-2}
      schY={3}
      {...placements?.C_AMP_IN_COUPLE}
    />

    {volumeControl && (
      <CL10A105KB8NNNC
        name="C_VOLUME_IN"
        maxVoltageRating="50V"
        schSectionName={schSections.input}
        schX={-5}
        schY={6}
        {...volumeControl.inputCapPlacement}
      />
    )}
    {volumeControl && (
      <RK10J12E002L
        name="RV_VOLUME"
        schSectionName={schSections.input}
        schX={-2}
        schY={6}
        schHeight={0.8}
        // First gang: common low=pin1, wiper=pin2, high=pin3.
        // The second gang and retaining tabs are not electrical connections.
        noConnect={["pin4", "pin5", "EH1", "EH2"]}
        {...volumeControl.wheelPlacement}
      />
    )}

    <PAM8403DR_H
      name="U_SPK_AMP"
      schSectionName={schSections.amplifier}
      pcbX={16}
      pcbY={-5}
      pcbRotation={-90}
      schX={3}
      schY={3}
      schWidth={2.435}
      schHeight={1.8}
      schPinArrangement={{
        leftSide: {
          direction: "top-to-bottom",
          pins: ["PVDD1", "VDD", "MUTE", "INL", "VREF", "INR", "SHND", "PVDD2"],
        },
        rightSide: {
          direction: "top-to-bottom",
          pins: [
            "OUT_L_POS",
            "PGND1",
            "OUT_L_NEG",
            "GND",
            "OUT_R_NEG",
            "PGND2",
            "OUT_R_POS",
            "NC",
          ],
        },
      }}
      noConnect={["OUT_R_POS", "OUT_R_NEG", "NC"]}
    />
    <capacitor
      name="C_AMP_VDD"
      supplierPartNumbers={{ jlcpcb: ["C52923"] }}
      manufacturerPartNumber="CL05A105KA5NQNC"
      maxVoltageRating="25V"
      schSectionName={schSections.amplifier}
      capacitance="1uF"
      footprint="0402"
      schOrientation="vertical"
      pcbX={21}
      pcbY={-5}
      pcbRotation={-90}
      schX={2}
      schY={-2}
      {...placements?.C_AMP_VDD}
    />
    <capacitor
      name="C_AMP_VDD_BULK"
      supplierPartNumbers={{ jlcpcb: ["C59461"] }}
      manufacturerPartNumber="CL10A226MQ8NRNC"
      maxVoltageRating="6.3V"
      schSectionName={schSections.amplifier}
      capacitance="22uF"
      footprint="0603"
      schOrientation="vertical"
      pcbX={24}
      pcbY={-5}
      pcbRotation={-90}
      schX={6}
      schY={-2}
      {...placements?.C_AMP_VDD_BULK}
    />
    <capacitor
      name="C_AMP_VREF"
      supplierPartNumbers={{ jlcpcb: ["C52923"] }}
      manufacturerPartNumber="CL05A105KA5NQNC"
      maxVoltageRating="25V"
      schSectionName={schSections.amplifier}
      capacitance="1uF"
      footprint="0402"
      schOrientation="vertical"
      pcbX={10}
      pcbY={-5}
      pcbRotation={90}
      schX={-2}
      schY={-2}
      {...vrefPlacement}
    />

    <BLM18PG121SN1D
      name="FB_SPK_POS"
      schSectionName={schSections.output}
      pcbX={20}
      pcbY={9}
      pcbRotation={90}
      schX={8}
      schY={4.2}
      {...placements?.FB_SPK_POS}
    />
    <BLM18PG121SN1D
      name="FB_SPK_NEG"
      schSectionName={schSections.output}
      pcbX={12}
      pcbY={9}
      pcbRotation={90}
      schX={8}
      schY={1.8}
    />
    <capacitor
      name="C_SPK_EMI_POS"
      supplierPartNumbers={{ jlcpcb: ["C1530"] }}
      manufacturerPartNumber="0402B221K500NT"
      maxVoltageRating="50V"
      schSectionName={schSections.output}
      capacitance="220pF"
      footprint="0402"
      schOrientation="vertical"
      pcbX={20}
      pcbY={15}
      pcbRotation={90}
      schX={11}
      schY={6.5}
    />
    <capacitor
      name="C_SPK_EMI_NEG"
      supplierPartNumbers={{ jlcpcb: ["C1530"] }}
      manufacturerPartNumber="0402B221K500NT"
      maxVoltageRating="50V"
      schSectionName={schSections.output}
      capacitance="220pF"
      footprint="0402"
      schOrientation="vertical"
      pcbX={12}
      pcbY={15}
      pcbRotation={90}
      schX={11}
      schY={-0.5}
    />
    <SM02B_PASS_TBT_LF__SN_
      name="J_SPK"
      schSectionName={schSections.output}
      pcbX={16}
      pcbY={20.78745315}
      pcbRotation={180}
      {...speakerConnectorPlacement}
      schX={14}
      schY={3}
      schWidth={1.4}
      schHeight={0.6}
      schPinArrangement={{
        leftSide: {
          direction: "top-to-bottom",
          pins: ["pin1", "pin2"],
        },
        rightSide: {
          direction: "top-to-bottom",
          pins: ["pin3", "pin4"],
        },
      }}
    />

    <trace
      from="net.AUDIO_PWM"
      to=".R_AMP_IN > .pin1"
      {...signalTraceProps}
      schDisplayLabel="AUDIO_PWM"
    />
    <trace
      from=".R_AMP_IN > .pin2"
      to=".C_AMP_PWM_FILTER > .pin1"
      {...signalTraceProps}
      schDisplayLabel="PWM_FILTER"
    />
    <trace
      from=".C_AMP_PWM_FILTER > .pin2"
      to="net.GND"
      {...signalTraceProps}
      {...gndLabel}
    />
    <trace
      from=".R_AMP_IN > .pin2"
      to={volumeControl ? ".C_VOLUME_IN > .pin1" : ".C_AMP_IN_COUPLE > .pin1"}
      {...signalTraceProps}
      schDisplayLabel="FILTERED_PWM"
    />
    {/* ALPS RK10J12E002L datasheet (C231765), pp.1-3: AC-only, 10k dual.
        https://datasheet.lcsc.com/datasheet/pdf/ed9069aadf334d75988cb60bb3b95a24.pdf
        Block PWM DC before the divider and retain C_AMP_IN_COUPLE after it
        to isolate PAM8403 input bias. */}
    {volumeControl && (
      <trace name="VOLUME_IN" from=".C_VOLUME_IN > .pin2" to=".RV_VOLUME > .pin3" {...signalTraceProps} />
    )}
    {volumeControl && (
      <trace name="VOLUME_WIPER" from=".RV_VOLUME > .pin2" to=".C_AMP_IN_COUPLE > .pin1" {...signalTraceProps} />
    )}
    {volumeControl && (
      <trace name="VOLUME_GND" from=".RV_VOLUME > .pin1" to="net.GND" {...signalTraceProps} {...gndLabel} />
    )}
    <trace
      from=".C_AMP_IN_COUPLE > .pin2"
      to=".U_SPK_AMP > .INL"
      {...signalTraceProps}
      schDisplayLabel="AMP_IN"
    />
    <trace
      from=".U_SPK_AMP > .INR"
      to="net.GND"
      {...signalTraceProps}
      {...gndLabel}
    />
    <trace
      from=".U_SPK_AMP > .MUTE"
      to="net.V3V3"
      {...signalTraceProps}
      {...v3v3Label}
    />
    <trace
      from=".U_SPK_AMP > .SHND"
      to="net.V3V3"
      {...signalTraceProps}
      {...v3v3Label}
    />

    <trace
      from=".U_SPK_AMP > .VDD"
      to="net.VSYS"
      {...powerTraceProps}
      {...vsysLabel}
    />
    <trace
      from=".U_SPK_AMP > .PVDD1"
      to="net.VSYS"
      {...powerTraceProps}
      {...vsysLabel}
    />
    <trace
      from=".U_SPK_AMP > .PVDD2"
      to="net.VSYS"
      {...powerTraceProps}
      {...vsysLabel}
    />
    <trace
      from=".U_SPK_AMP > .GND"
      to="net.GND"
      {...powerTraceProps}
      {...gndLabel}
    />
    <trace
      from=".U_SPK_AMP > .PGND1"
      to="net.GND"
      {...powerTraceProps}
      {...gndLabel}
    />
    <trace
      from=".U_SPK_AMP > .PGND2"
      to="net.GND"
      {...powerTraceProps}
      {...gndLabel}
    />
    <trace
      from=".C_AMP_VDD > .pin1"
      to="net.VSYS"
      {...powerTraceProps}
      {...vsysLabel}
    />
    <trace
      from=".C_AMP_VDD > .pin2"
      to="net.GND"
      {...powerTraceProps}
      {...gndLabel}
    />
    <trace
      from=".C_AMP_VDD_BULK > .pin1"
      to="net.VSYS"
      {...powerTraceProps}
      {...vsysLabel}
    />
    <trace
      from=".C_AMP_VDD_BULK > .pin2"
      to="net.GND"
      {...powerTraceProps}
      {...gndLabel}
    />
    <trace
      from=".U_SPK_AMP > .VREF"
      to=".C_AMP_VREF > .pin1"
      maxLength="5.5mm"
      {...signalTraceProps}
      schDisplayLabel="VREF"
    />
    <trace
      from=".C_AMP_VREF > .pin2"
      to="net.GND"
      maxLength="5.5mm"
      {...signalTraceProps}
      {...gndLabel}
    />

    <trace
      from=".U_SPK_AMP > .OUT_L_POS"
      to=".FB_SPK_POS > .pin1"
      {...speakerTraceProps}
      schDisplayLabel="L+"
    />
    <trace
      from=".FB_SPK_POS > .pin2"
      to=".J_SPK > .pin1"
      {...speakerTraceProps}
      schDisplayLabel="SPK_POS"
    />
    <trace
      from=".FB_SPK_POS > .pin2"
      to=".C_SPK_EMI_POS > .pin1"
      {...speakerTraceProps}
    />
    <trace
      from=".C_SPK_EMI_POS > .pin2"
      to="net.GND"
      {...signalTraceProps}
      {...gndLabel}
    />
    <trace
      from=".U_SPK_AMP > .OUT_L_NEG"
      to=".FB_SPK_NEG > .pin1"
      {...speakerTraceProps}
      schDisplayLabel="L-"
    />
    <trace
      from=".FB_SPK_NEG > .pin2"
      to=".J_SPK > .pin2"
      {...speakerTraceProps}
      schDisplayLabel="SPK_NEG"
    />
    <trace
      from=".FB_SPK_NEG > .pin2"
      to=".C_SPK_EMI_NEG > .pin1"
      {...speakerTraceProps}
    />
    <trace
      from=".C_SPK_EMI_NEG > .pin2"
      to="net.GND"
      {...signalTraceProps}
      {...gndLabel}
    />
    <trace
      from=".J_SPK > .pin3"
      to="net.GND"
      {...signalTraceProps}
      {...gndLabel}
    />
    <trace
      from=".J_SPK > .pin4"
      to="net.GND"
      {...signalTraceProps}
      {...gndLabel}
    />
  </group>
)

export default AudioAmplifier_GlobalLayout
