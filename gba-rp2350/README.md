# Full Game Boy Advance routing candidates

Copied from the local Game Boy Advance storage/RAM project on 2026-09-06.
The old Pico project at the repository root is retained. The separate RP2350
project is unchanged.

All candidates use the same locked tscircuit 0.0.2463 dependencies, four layers,
Pipeline 9, all components on top, and the full 108-component storage/RAM design.
No manual copper traces, explicit via components, breakouts or removed nets are
introduced. Imported local CAD assets are included only where source imports
require them.

| Candidate | Change |
| --- | --- |
| baseline | Current full storage/RAM global route |
| cap-escape | Move only C_PSRAM_HF out of the flash/PSRAM corridor |
| supply-pours | Same move plus native V3V3/VSYS inner-2 regions and local PSRAM supply copper |

Ordinary pours fill after routing. `unbroken` reserves the two supply regions
from unrelated same-layer traces, but does not eliminate the associated net
routing demands. All source connections remain and will still be autorouted.
The optional fanout plane-termination path has not been enabled: its current
metadata does not represent disconnected polygon regions, so an assumed plane
connection is insufficient evidence of physical continuity.

GitHub PR CI performs typechecking, full native routing, netlist/component/
protected-placement comparisons, and Gerber shorts checks at 50 and 100 pixels/mm.
It uploads Circuit JSON, SVGs, reports and logs even when a candidate fails.
The zero-DRC acceptance gate deliberately fails if any reported error, missing
connection or overlength warning remains. A lower count is not an orderable board.
