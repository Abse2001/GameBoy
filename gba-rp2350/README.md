# Full Game Boy Advance routing candidates

Copied from the local Game Boy Advance storage/RAM project on 2026-09-06.
The old Pico project at the repository root is retained. The separate RP2350
project is unchanged.

Current candidates use locked tscircuit 0.0.2465 dependencies, four layers,
Pipeline 9, all assembled components on top, and the storage/RAM design.
No manual copper traces, explicit via components, breakouts or removed nets are
introduced. Imported local CAD assets are included only where source imports
require them.

| Candidate | Change |
| --- | --- |
| baseline | Current full storage/RAM global route |
| cap-escape | Move only C_PSRAM_HF out of the flash/PSRAM corridor |
| supply-pours | Same move plus native V3V3/VSYS inner-2 regions and local PSRAM supply copper |
| usb-escape | Swap only the USB series resistor positions to follow the MCU D+/D− pad order |

The first capacitor trial was rejected before routing due to a PSRAM courtyard
overlap. Its corrected board position is (6.7, -10.65), rotation 0. The imported
courtyards are separated at this position; CI still verifies the actual layout.

The latest housing-envelope candidates are
`experiments/fabrication/placement-storage-gba-power-planes-clock-first.circuit.tsx`
and `experiments/fabrication/placement-storage-gba-power-planes-global.circuit.tsx`.
They use a clean 131.32 × 72.42 mm rectangular outline and 1 mm PCB thickness.
The package's default entry has not been promoted to these experimental files.

Ordinary pours fill after routing. The latest power-plane trials use `unbroken`
for a ground-reference layer and separate V3V3, V1V1 and VSYS regions on inner2.
The router can generate plane escapes for these reserved regions. All source
connections remain: neither a filled polygon nor a generated plane escape is
accepted as proof of continuity without the routing and Gerber checks.

The membrane contact geometry and placement are derived from OpenTendo-AGB,
commit `dba1e35571da9c9448f5f7fd9f55c6aaa15c2806`, under CC BY-SA 4.0.
Attribution and modification details are in `GbaReferenceButtonContacts.circuit.tsx`.
Unlike the previous comb footprint, all 22 contact routing endpoints lie inside
their own copper. The check suite verifies this, isolation, auxiliary-island
connections, no solder paste, and exclusion from assembly placement.

GitHub PR CI performs typechecking, full native routing, netlist/component/
protected-placement comparisons, and Gerber shorts checks at 50 pixels/mm,
followed by 100 pixels/mm when the first check finds no shorts.
It attempts to upload Circuit JSON, SVGs, reports and logs even when a candidate
fails. GitHub artifact quota is currently exhausted; reports, generated Circuit
JSON/SVG and phase diagnostics are also printed into the job log.
The zero-DRC acceptance gate deliberately fails if any reported error, missing
connection or overlength warning remains. A lower count is not an orderable board.

This is **not fabrication-ready**. See `FABRICATION_STATUS.md` for measured
routing failures and the outstanding mechanical/electrical signoff items.
