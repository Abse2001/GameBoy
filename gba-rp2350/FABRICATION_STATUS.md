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
| `65cbe98` / corrected LDO capacitor and restored resistors | 277 PCB traces, 262 vias; routing completed | 13: 9 via/pad clearance reports, 2 trace/via accidental contacts, 2 maximum-via violations; plus 19 length warnings | 5 detections at 50 pixels/mm; includes V3V3/V1V1 contact, not ready |
| `0a8a550` / C12 channel | 277 PCB traces, 261 vias; routing completed | 11, plus 18 length warnings | 3 detected by the shorts check; not ready |
| `0a8a550` / flash facing MCU | 277 PCB traces, 277 vias; routing completed, Core errors regressed | 24, plus 18 length warnings | 3 detected at 50 pixels/mm; reject flash relocation |
| `6ec4dde` / C18 west | 277 PCB traces, 271 vias; routing completed, regressed | 16, plus 21 length warnings | 5 detected at 50 pixels/mm; rejected |
| `524f887` / C12 + C17 channel | 277 PCB traces, 284 vias; routing completed, regressed | 30, plus 17 length warnings | 4 detected at 50 pixels/mm; rejected |
| `6ce06c8` / C12 + SD capacitor rotation | 277 PCB traces, 255 vias; mixed result | 17, plus 18 length warnings | 2 detected at 50 pixels/mm, MISO against XIN and V3V3 near the crystal; not accepted |
| `524f887` / C12 clock first | Canceled at user direction after approximately 45 minutes; no completed full-board result | Not available, not zero | Not checked: canceled before finished copper |
| `fec3553` / C12 ordinary-group repeat | 277 PCB traces, 261 vias, 96 copper regions; full routing build took 20m55s | 11, plus 18 length warnings; matches the earlier C12 result | 3 detected at 50 pixels/mm; 100 pixels/mm skipped after failure, not passed |
| `e59bbc8` / root C12 repeat | 277 PCB traces, 261 vias, 96 copper regions; matches prior baseline | 11, plus 18 length warnings | 3 reported at 50 pixels/mm; not ready |
| `e59bbc8` / C14 inner channel | 277 PCB traces, 275 vias, 93 copper regions; mixed result, not promoted | 17 (2 maximum-via, 14 via/pad clearance, 1 via/pad overlap), plus 23 length warnings | 1 at 50 pixels/mm: VREG_AVDD/GND at (-2.770, 4.970); 100 pixels/mm skipped, not passed |

Evidence: [single-phase run and broad-plane comparison](https://github.com/Abse2001/GameBoy/actions/runs/34096366893),
[corrected-plane run](https://github.com/Abse2001/GameBoy/actions/runs/34097162607).
[Reference-contact result](https://github.com/Abse2001/GameBoy/actions/runs/34099225875/job/101669578145).
[Closer-decoupler result](https://github.com/Abse2001/GameBoy/actions/runs/34099573916/job/101670670212).
[V1V1-plane comparison](https://github.com/Abse2001/GameBoy/actions/runs/34100690651).
[Corrected LDO result](https://github.com/Abse2001/GameBoy/actions/runs/34106069834/job/101691251748).
[C12 and flash comparison](https://github.com/Abse2001/GameBoy/actions/runs/34107943064).
[C18 result](https://github.com/Abse2001/GameBoy/actions/runs/34109015255).
[C17 result](https://github.com/Abse2001/GameBoy/actions/runs/34111058889/job/101707165934).
[SD capacitor result](https://github.com/Abse2001/GameBoy/actions/runs/34113209572/job/101713939428).
[Ordinary-group repeat](https://github.com/Abse2001/GameBoy/actions/runs/34115710932/job/101721879869).
[Root/C14 comparison](https://github.com/Abse2001/GameBoy/actions/runs/34123911135).

Later contact and capacitor-placement jobs are separate trials. Their local
routing-disabled renders pass placement, type and netlist checks; that is not a
physical routing or short-check pass.

## Board-input corrections under test

### Routing scope: ordinary groups, board-level phases allowed

The latest completed SD trial already had one global Pipeline 9 pass:
149 connections, 1,066 obstacles and zero previously routed traces. All nine
child groups are ordinary groups; only the board root has `is_subcircuit: true`.
This board-root metadata is required and is not a separate child route.
MCU and wrapper defaults now use ordinary groups; power/audio global variants
use `GroupProps`. Before the expensive CI route, a routing-disabled render and
hierarchy check reject any independently routed child group or trace outside
the root board scope. Board-level routing phases remain allowed.

The canceled clock-first run used two phases of this same board, not child
subcircuits. Its second phase entered `traceSimplificationSolver` at 10:46:43
UTC and was still there at 11:06:45 UTC, reporting 71% throughout those 20
minutes. This identifies the observed stage bottleneck, not a proven inner
solver defect. No engine change or manual routing bypass was made.

The C12 repeat with the hierarchy guard completed and reproduced 11 Core errors:
five trace errors (two maximum-via violations and three accidental contacts),
one pad/trace clearance, two via/trace clearances and three via/pad clearances.
Its 18 trace-length warnings and three reported Gerber shorts still fail signoff.
The group cleanup preserves component identities, values, netlist and protected
positions; it does not by itself fix the generated copper.

The root `index.circuit.tsx` and package `main` now select this same C12 board,
matching CI instead of the older storage layout. Local routing-disabled renders
verify identical parts, source connectivity and protected positions. The board
is a symmetric 131.32 x 72.42 mm outline; that is not a certified stock-shell fit.
The standalone RP2350 project and the separate legacy project at the repository
root are untouched. Cloud CI performs the full routing and physical shorts checks.

The C14 isolated trial moves only C14 to `(4.9, -1.1)` in the MCU essentials'
coordinate system, maintaining its rotation, value and connections. Its board
position becomes `(-4.9, 8.1)`. This aligns its supply pad with U1.IOVDD2 and
reduces their straight-line distance to 0.905 mm. It opens a pad-clear path on
the MCU side of C11 toward C17, beside the two existing V3V3/GND crossings.
The smallest component pad gap is 0.1598 mm, above the unchanged 0.1 mm rule.
Routing-disabled checks pass with only C14's placement changed. The complete
cloud result removes the earlier west-bank trace contacts, but increases Core
errors from 11 to 17 and length warnings from 18 to 23 while Gerber-50 shorts
drop from three to one. Both candidates preserve all parts, source connections,
protected positions and top-side assembly. C14 is not promoted to the root
entry; the remaining ground via contact near VREG_AVDD and the other via/pad
conflicts must be addressed before this can be considered a better board.

No child subcircuits, fanout stages, manual traces, explicit vias, relaxed checks
or modified router packages are introduced. Native fanout would add a routing
stage with its own default solver; it is left off for this fully global Pipeline
9 placement comparison.

### Next trial: C6 input-capacitor approach

On the unpromoted C14 variant, move only C6 from source `(1.2, 4.2)` to
`(1.2, 3.75)`, keeping rotation 90 degrees. Its board center becomes
`(-1.2, 3.25)`. The VIN-pad distance falls to 0.917 mm and the PGND-pad
distance to 2.101 mm. Minimum component-box separation remains 0.188 mm to
U1 and 0.330 mm to L1; the existing regulator-side passage is not narrowed.
This changes an actual PGND branch endpoint, not a synthetic routing anchor.
Local typecheck and routing-disabled render pass. Source parts, netlist,
protected placements and top-side assembly match the C14 control exactly;
only C6's PCB center changes. The hierarchy check confirms one root board and
no child subcircuits. These preflight results do not certify routed copper.
The offending ground via position touches a fixed MCU pad, so better capacitor
geometry does not guarantee that the global solver will relocate it safely.

Compare against a repeated C14 control in cloud CI. C12 remains the root
entry; no experimental variant is promoted. Preserve parts, connections,
trace limits, crystal/MCU/PSRAM and control/connector positions. No handwritten
trace geometry or vias are added. The user-requested 15-minute task follow-up
now resumes placement work after each cloud result, with no duplicate batches.

The C14 result's 14 via/pad clearance reports represent eight distinct physical
via/pad pairs at six via sites; coincident same-net via records account for six
repeated reports. They are not electrically safe false positives. The crystal
overlap is a START-net through-via whose logical bottom/inner1 transition still
occupies top copper. The other five sites already include top in their logical
spans, so hidden through-via occupancy does not explain all of the failures.
Keep the full reported count in the acceptance gate.

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
   The reference shoulder edges are around Y=24.6–26 mm, versus the rectangle's
   Y=36.21 mm: roughly 10–12 mm of extra PCB at those sites. Restoring the
   reference edge would put J_HEADER's first three holes about 4.9–5.8 mm
   beyond that edge. Preserving both the current connector placement and an
   unmodified original housing has not been demonstrated.
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
   C5333729 currently has zero immediately available order quantity in JLC's
   assembly portal. On September 7, its exact-part page offered pre-order with
   minimum quantity 3 and an estimated 11-day lead time; acceptance, eventual
   assembly availability and delivery are unconfirmed. Keep the exact part;
   no substitution or order has been made. Generic footprint
   similarity warnings alone do not establish a wrong package, but neither do
   they provide dimensional signoff. Membrane contacts require exposed copper,
   no paste and an appropriate wear-resistant finish (reference: ENIG).
8. **Bring-up:** zero DRCs does not prove firmware compatibility, oscillator
   startup, signal integrity, temperature margin or actual Game Boy emulation.
   Prototype bring-up remains necessary before claiming a functional product.
9. **Assembly exports:** the installed CLI's bundled BOM and PnP converters
   iterate every `pcb_component`, including the eight `do_not_place` membrane
   contacts. The Gerber ZIP path calls them with the unfiltered circuit JSON.
   Do not submit those assembly CSVs as-is. Bare copper contacts must remain in
   copper/mask exports but not in populated BOM/PnP rows. This is an exporter
   issue, not a routing correction; no package patch or hand-edited export has
   been applied. The 22 electrode polygons have solder mask openings and no
   associated paste records in the inspected routed baseline.
   Remove the old negative `solderPasteMargin` declaration from those polygons:
   the installed renderer ignored it, and absence of paste is verified from the
   generated data instead of relying on an ineffective setting.
   Four bare test pads (TP_SWCLK, TP_SWDIO, TP_GND and TP_3V3) also need assembly
   exclusion; their source declarations are now explicitly `doNotPlace`.
   The installed Core creates paste on uncovered circular test pads, so their
   stencil treatment still needs resolving. Do not cover the test pads with
   solder mask or alter their copper shape merely to suppress paste output.

## Independent placement trials

Two candidates preserve the full 106-component source netlist, parts, values,
and all protected placements (MCU, crystal, PSRAM, buttons and connectors).
Local routing-disabled builds have zero placement errors and pass the 15
imported-parts/storage checks. Those checks are not physical short-check passes.

- `placement-storage-gba-c12-channel`: rotate/reposition only C12 to local
  `(-0.2, 3.8, 90 degrees)`, board `(0.2, 3.2, 270 degrees)`, opening the USB/QSPI
  exit corridor. Its supply-pad-to-MCU straight-line distance is 0.927 mm.
- `placement-storage-gba-flash-facing-mcu`: independently move/rotate only U2
  to local `(-2.6, 7, 180 degrees)`, board `(2.6, 0, 0 degrees)`, facing its
  clock/data row toward U1. Leave C_FLASH fixed; the supply connection's
  straight-line lower bound is 2.795 mm, below the unchanged 5.5 mm limit.

Both require full Pipeline 9 routing, Core DRC and Gerber short checks in CI.
No routing result is claimed from the arithmetic placement checks.

The subsequent `placement-storage-gba-c18-west` trial independently changes only
C18 to local `(1.6, -5.55, 0 degrees)`, board `(-1.6, 12.55, 180 degrees)`.
It targets the measured V3V3 branch crossing V1V1 vias near `(-1.30, 13.46)`.
The intended C18 supply-pad-to-IOVDD4 straight-line distance is 2.536 mm,
below the existing 5.5 mm limit. R2, USB resistors, crystal, MCU and all other
placements remain as in the corrected LDO baseline. This trial is independent
of the C12 and flash trials; a changed endpoint is not proof of a safe route.

Next independent tests use the better C12 result as their starting point:

- `placement-storage-gba-c12-c17-channel`: move/rotate only C17 relative to C12,
  local `(5.3, 0.9, 90 degrees)`, board `(-5.3, 6.1, 270 degrees)`. The supply pad
  faces C14 and its ground pad faces C9/C7; this opens a channel past C11 for
  the V3V3 branch that crossed two ground traces. ADC_AVDD straight-line
  decoupling distance is 1.910 mm, below 5.5 mm.
- `placement-storage-gba-c12-clock-first`: retain C12 placement and use the
  existing clock-first autorouting phase, with no extra component moves and no
  changes to clock via/length limits. Then autoroute the remaining board.

These tests do not edit the router, routes, minimum clearances, or connectivity.

The next independent `placement-storage-gba-c12-sd-cap-facing` trial keeps C12
and rotates only C_SD_HF from local 90 to 270 degrees at its unchanged center.
Its supply pad faces J_SD.VDD and its ground pad faces U_SD_ESD. Straight-line
distances are 2.593 mm to socket VDD, 3.442 mm to ESD ground, 2.120 mm to the
bulk capacitor's supply pad, and 1.900 mm to R_SD_DAT0's supply pad. All are
below 5.5 mm; this is a placement hypothesis, not a routed pass. Parts/values,
source netlist, protected placements and top-side status match the C12 baseline.

The 18 length warnings in the completed C12 baseline comprise one XIN branch,
three V1V1 branches, twelve GND branches and two SD supply branches. Several
generated shared-net branches inherit a local 5.5-mm limit despite endpoints
already farther apart: U1.VREG_FB-to-DVDD3 is 5.523 mm straight-line, RGB buffer
ground-to-RGB capacitor ground is 8.448 mm, and SD ESD ground-to-audio VREF
capacitor ground is 19.119 mm. Those particular branches cannot satisfy the
limit through passive nudges; a different automatic tree topology or corrected
constraint handling is required. No warnings are suppressed.

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

An additional geometry audit of C12's routed output found 37 wire records below
the board's 0.1-mm width across 15 ground traces. They are covered pad-entry
geometry: 31 segments lie within their own ground electrode, three are
zero-length wire/via transitions, and three boundary transitions are covered
by adjacent full-width copper and the pad. No external under-width bottleneck
was established. This does not clear the actual shorts or replace CAM review.

The installed input/output LDO capacitors are both C15849 / Samsung
CL10A105KB8NNNC, 1 uF ±10%, X5R, 50 V, 0603. Their nominal values match the
Diodes AP2112 application circuit; no nominal capacitor voltage/value or
resistor power/package mismatch was identified in the bounded supply-BOM
review. Effective capacitance and assembled thermal performance are not
proven by those nominal specifications alone.

Sources: [OpenTendo-AGB reference](https://github.com/Redherring32/OpenTendo-AGB/tree/dba1e35571da9c9448f5f7fd9f55c6aaa15c2806),
[AP2112 datasheet](https://www.diodes.com/datasheet/download/AP2112.pdf),
[MSP2807 schematic](https://www.lcdwiki.com/res/MSP2807/MSP2807-2.8-SPI.pdf),
[Abracon inductor datasheet](https://abracon.com/datasheets/AOTA-B201610S3R3-101-T.pdf).

Procurement follow-up: [exact selected PSRAM at JLC](https://jlcpcb.com/partdetail/C5333729).
