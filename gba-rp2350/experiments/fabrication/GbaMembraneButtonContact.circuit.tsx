import type { PushButtonProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1", "signal"],
  pin2: ["pin2", "ground"],
} as const

/**
 * Exposed interdigitated copper for a conductive-rubber button membrane.
 *
 * This is intentionally a PCB contact rather than an assembled tactile
 * switch. The two copper combs remain isolated until the housing's conductive
 * rubber puck presses onto them. A large negative paste margin prevents a
 * stencil aperture while leaving both copper combs exposed by solder mask.
 */
export const GbaMembraneButtonContact = ({
  contactOffsetX = 0,
  ...props
}: PushButtonProps<typeof pinLabels> & { contactOffsetX?: number }) => (
  <pushbutton
    pinLabels={pinLabels}
    manufacturerPartNumber="GBA_PCB_MEMBRANE_CONTACT"
    footprint={
      <footprint>
        <smtpad
          name="SIGNAL_COMB"
          pcbX={contactOffsetX}
          portHints={["pin1"]}
          shape="polygon"
          solderPasteMargin="-3mm"
          points={[
            { x: -2.8, y: -2.8 },
            { x: 0.9, y: -2.8 },
            { x: 0.9, y: -2.35 },
            { x: -1.4, y: -2.35 },
            { x: -1.4, y: -1.55 },
            { x: 0.9, y: -1.55 },
            { x: 0.9, y: -1.1 },
            { x: -1.4, y: -1.1 },
            { x: -1.4, y: -0.3 },
            { x: 0.9, y: -0.3 },
            { x: 0.9, y: 0.15 },
            { x: -1.4, y: 0.15 },
            { x: -1.4, y: 0.95 },
            { x: 0.9, y: 0.95 },
            { x: 0.9, y: 1.4 },
            { x: -1.4, y: 1.4 },
            { x: -1.4, y: 2.2 },
            { x: 0.9, y: 2.2 },
            { x: 0.9, y: 2.65 },
            { x: -2.8, y: 2.65 },
          ]}
        />
        <smtpad
          name="GROUND_COMB"
          pcbX={contactOffsetX}
          portHints={["pin2"]}
          shape="polygon"
          solderPasteMargin="-3mm"
          points={[
            { x: 2.8, y: -2.8 },
            { x: 1.4, y: -2.8 },
            { x: 1.4, y: -2.175 },
            { x: -0.9, y: -2.175 },
            { x: -0.9, y: -1.725 },
            { x: 1.4, y: -1.725 },
            { x: 1.4, y: -0.925 },
            { x: -0.9, y: -0.925 },
            { x: -0.9, y: -0.475 },
            { x: 1.4, y: -0.475 },
            { x: 1.4, y: 0.325 },
            { x: -0.9, y: 0.325 },
            { x: -0.9, y: 0.775 },
            { x: 1.4, y: 0.775 },
            { x: 1.4, y: 1.575 },
            { x: -0.9, y: 1.575 },
            { x: -0.9, y: 2.025 },
            { x: 1.4, y: 2.025 },
            { x: 1.4, y: 2.8 },
            { x: 2.8, y: 2.8 },
          ]}
        />
        <silkscreencircle pcbX={0} pcbY={0} radius="3.2mm" />
      </footprint>
    }
    {...props}
  />
)
