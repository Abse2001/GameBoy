# GBA fabrication readiness — 2026-09-07

Status: **not ready to order**. No manufacturing files have been approved.

## Measured routing results

All runs use published packages, Pipeline 9 and automatically generated traces.
Heavy routing and Gerber short checks run only in GitHub CI.

| Commit / candidate | Result | Core errors | Shorts |
| --- | --- | --- | --- |
| `c77e0ae` / single phase | 271 PCB traces, 288 vias; routing completed | 32, plus 23 length warnings | 1 at 50 pixels/mm, near U1.XOUT/R2 and V3V3; 100 pixels/mm not run after the failure |
| `c77e0ae` / power planes, global | Routing timeout after 2409 seconds; no completed circuit emitted | Not available, not zero | Not checked: no completed routed output |
| `66c5aa6` / corrected planes, clock first | Main phase failed on a V1V1 branch after the clock phase | 1 routing failure and 416 consequent missing-connection errors | Not checked: no completed routed output |
| `66c5aa6` / corrected planes, global | Routing timeout after 2411 seconds; no completed circuit emitted | Not available, not zero | Not checked: no completed routed output |
| `f8690c3` / reference contacts, single phase | 277 PCB traces, 262 vias; routing completed | 29, plus 20 length warnings | 12 detected at 50 pixels/mm; rejected despite lower Core error count |
| `d3e9752` / closer decouplers, single phase | 277 PCB traces, 270 vias; routing completed | 18, plus 18 length warnings | 8 detected at 50 pixels/mm; not ready |
| `c48bc09` / V1V1 inner plane, global and clock first | Both failed in high-density routing; no finished copper | Each has 1 router failure and 422 consequent missing-connection errors | Not checked: no completed routed output |
| `d3e7619` / larger phase margin | 277 PCB traces, 285 vias; routing completed, but regressed | 50, plus 18 length warnings | 18 at 50 pixels/mm; rejected |
| `f39414b` / same larger margin, top fill outside contacts | 277 PCB traces, 285 vias; routing completed | 50, plus 18 length warnings | 13 at 50 pixels/mm; contact-field fill exclusion helps, margin still rejected |
| `1249dbd` / shorter USB and shifted R2, global and clock first | Both exhausted HB solver iterations | Each has 1 routing failure plus 422 consequent missing-connection errors | Not checked: no completed routed output; these resistor moves reverted |
| `b8bfd9d` / genuine LDO | Routing precheck rejected C_3V3_OUT ground distance: 5.96 mm exceeds 5.5 mm | 1 routing failure plus 422 consequent missing-connection errors | Not checked: no completed routed output; capacitor repositioned for next trial |

Evidence: [single-phase run and broad-plane comparison](https://github.com/Abse2001/GameBoy/actions/runs/34096366893),
[corrected-plane run](https://github.com/Abse2001/GameBoy/actions/runs/34097162607).
[Reference-contact result](https://github.com/Abse2001/GameBoy/actions/runs/34099225875/job/101669578145).
[Closer-decoupler result](https://github.com/Abse2001/GameBoy/actions/runs/34099573916/job/101670670212).
[V1V1-plane comparison](https://github.com/Abse2001/GameBoy/actions/runs/34100690651).

Later contact and capacitor-placement jobs are separate trials. Their local
routing-disabled renders pass placement, type and netlist checks; that is not a
physical routing or short-check pass.

## Board-input corrections under test

- Replace concave comb contacts whose inferred route endpoints fell in empty
  gaps with the actual OpenTendo contact geometry. All 22 new endpoints are
  inside their own electrode copper, with no signal/GND netlist merge.
- Keep the controls at the reference contact centers, not arbitrary congestion
  offsets. R_BAT_GATE_BASE moves clear of SELECT instead.
- Correct local copper island coordinates to follow the translated MCU content.
- Move C18 and C_FLASH closer to their own supply pins. MCU, crystal and PSRAM
  remain fixed; component values and electrical connectivity do not change.
- Test a continuous inner1 ground reference and separate inner2 supply regions,
  including the MCU's V1V1 rail. No trace geometry, explicit vias or breakout
  points are authored by hand.
- Pin the audio passive BOM to the matching JLC selections already used by CI.
- A separate manufacturing-margin trial asks the routing phase for 0.15 mm
  trace-to-pad and 0.2 mm via-to-pad clearance, above the existing 0.1 mm board
  minimum. It does not disable checks or edit the resulting copper.
- Keep broad top ground fill outside the membrane-contact fields. The latest
  generated GND pour touched SW_A signal copper along its boundary, despite
  the reference signal and ground electrode polygons being isolated. Buttons,
  logical connections and the bottom/inner ground coverage are unchanged.
- The R2 and R7/R8 placement trial was reverted after both global and
  clock-first runs failed. Retain the earlier resistor positions, without
  extra routing margins or reserved supply planes. MCU, crystal, PSRAM and
  all connector/button placements remain unchanged.
- Correct the LDO to genuine Diodes C51118. The previous C23380830 supplier
  number resolves to TECH PUBLIC, so Diodes' specifications could not certify
  that silicon. The new JLC import includes its exact footprint, OBJ and STEP;
  rotate it 90 degrees relative to the old library to preserve the pin sides.
  Move C_3V3_OUT clear of the new courtyard: direct distances are 1.795 mm to
  VOUT and 4.753 mm to regulator GND, both below the unchanged 5.5 mm limit.

## Remaining signoff items

1. **Physical copper:** require zero Core errors, complete routing, respected
   length/via constraints and passing Gerber shorts checks on all four layers.
   Some merged ground-branch length warnings inherit a local capacitor's limit
   on remote endpoints; do not move unrelated parts or suppress warnings to hide
   this. Assess the actual constrained endpoint pair as well as the emitted flag.
2. **Housing:** a matching bounding rectangle does not certify stock-case fit.
   The reference has 13 circular mechanical openings and four internal slots.
   They are not currently reproduced. Whether the case may be trimmed is an
   outstanding user choice. Outward connector overhang needs a shell model or
   physical dimension check, not just pad-to-edge clearance.
3. **Controls:** L/R shoulder switches and the requested left-side volume wheel
   still need mechanically verified implementation. A contact pad center is not
   an actuator center. The existing RK10J12E002L is a through-hole dual 10k pot,
   not an SMD part; its original left placement does not prove case-opening fit.
4. **SPI expansion:** the external SPI connector and LCD currently share GPIO17
   as chip select. They cannot be independently selected. Assigning a separate
   free GPIO is awaiting user confirmation; no pin remapping has been made.
5. **Power budget:** AP2112's 600 mA rating does not establish a safe continuous
   5 V-to-3.3 V load in the assembled enclosure. At 200 mA the nominal loss is
   0.34 W; the datasheet's 184 °C/W figure implies about 63 °C rise under its test
   conditions. Confirm worst-case load, copper/thermal conditions and ambient.
   Battery/boost and speaker load also need a bounded maximum-current budget.
6. **Display:** the LCDWIKI MSP2807 module is approximately 86 × 50 mm. The
   current housing variant shows only its electrical header, not a proven
   mounted module/display-window/height arrangement. Its 5 V supply jumper
   configuration and signal-level requirements must be verified at assembly.
7. **Manufacturing:** verify real inductor height, courtyards, stencil, drill and copper stackup, connector
   access, BOM/placement orientation and live assembly stock. The exact PSRAM
   C5333729 currently has zero available order quantity in JLC's assembly
   portal; it is a procurement blocker, not silently substituted. Generic footprint
   similarity warnings alone do not establish a wrong package, but neither do
   they provide dimensional signoff. Membrane contacts require exposed copper,
   no paste and an appropriate wear-resistant finish (reference: ENIG).
8. **Bring-up:** zero DRCs does not prove firmware compatibility, oscillator
   startup, signal integrity, temperature margin or actual Game Boy emulation.
   Prototype bring-up remains necessary before claiming a functional product.

## Dimensional checks completed

The PSRAM copper matches the current JLC module exactly: 0.588010 × 1.7999964 mm
oval pads, 1.27 mm pitch and 5.199888 mm row-center spacing. Its pin numbering and
orientation match the manufacturer SOP-8 drawing. The MT3608 pads match JLC to
approximately 0.002 mm rounding; it is SOT23-6 despite the footprint generator's
`dfn6` name. The manufacturer recommends a somewhat larger land pattern than
JLC, so final solder-margin approval remains the assembler's check. Neither IoU
warning establishes a wrong or disconnected footprint.

The actual Abracon L1 body is 2.0 × 1.6 × 1.0 mm; its generic rendered model does
not yet represent that mechanical envelope. See [key-part stock audit](JLC_STOCK_AUDIT.md)
for dated portal figures. This is not a reservation or a full-BOM availability guarantee.

Sources: [OpenTendo-AGB reference](https://github.com/Redherring32/OpenTendo-AGB/tree/dba1e35571da9c9448f5f7fd9f55c6aaa15c2806),
[AP2112 datasheet](https://www.diodes.com/datasheet/download/AP2112.pdf),
[MSP2807 schematic](https://www.lcdwiki.com/res/MSP2807/MSP2807-2.8-SPI.pdf),
[Abracon inductor datasheet](https://abracon.com/datasheets/AOTA-B201610S3R3-101-T.pdf).
