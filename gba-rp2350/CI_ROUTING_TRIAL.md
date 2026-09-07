# Current cloud routing trial

Entry: `experiments/fabrication/placement-storage-gba-internal-connectors-pipeline7-c18-clearance.circuit.tsx`.

This is the current 113-component Game Boy board with restored L/R switches,
left volume wheel, independent SPI expansion chip select, SD and PSRAM.
Battery and speaker connectors are inside the board; the battery cable has
a native board cutout and an all-layer copper keepout. The other external
connectors and buttons retain their placements.

The trial uses one global Pipeline 7 solve (`auto` + `beta_pipeline7`), with
no child subcircuits, fanout phases, stored routes, manual route points or
authored vias. Compared with the completed local Pipeline 7 control, only
C18 moves 1.2 mm east to board (2.7, 12.55). MCU, crystal, oscillator parts,
PSRAM and controls remain fixed. Electrical values and connections do not
change. Existing length/via constraints remain enforced.

The local control completed with zero autorouting/missing-connection errors
and zero shorts at both 50 and 100 px/mm, but still had 11 Core errors and
17 electrical length warnings. Clock-first routing and whole-chip native
fanout trials did not complete. The C18-only trial was stopped after 70.23 s
by the local low-disk guard; it has no final routing result. Cloud CI now
runs that exact placement candidate, not the older clock-resistor experiment.

CI records the locked package versions, verifies unrouted input, then routes
with a 30-minute external hard timeout. It preserves diagnostics and actual
PCB output, checks parts/netlist/placements/declared constraints and controls,
checks battery-cutout copper clearance, runs all-layer Gerber shorts at 50
and 100 px/mm, and requires zero Core errors and critical electrical warnings.
Empty output, a successful CLI exit with errors, or skipped checks cannot pass.

No fabrication readiness or mechanical fit is claimed. Previous GitHub jobs
were blocked by account billing; a newly submitted run must actually start
and complete before any cloud routing result can be reported.
