# GBA key-part procurement audit

Read-only JLC assembly-parts portal check on **2026-09-07, 09:01–09:03 UTC**.
These are not LCSC shop quantities. JLC labels `overseasStockCount` as “In Stock”
and `canPresaleNumber` as “Available Order Qty.” Neither reserves inventory.

| Part | JLC listing | In stock | Available order quantity |
| --- | --- | ---: | ---: |
| RP2350A | [C42411118](https://jlcpcb.com/partdetail/C42411118) | 10,416 | 9,966 |
| W25Q16JVUXIQ flash | [C2843335](https://jlcpcb.com/partdetail/C2843335) | 3,778 | 2,748 |
| APS6404L-3SQR-SN PSRAM | [C5333729](https://jlcpcb.com/partdetail/C5333729) | 1 | **0 — procurement blocker** |
| USB-C TYPE-C 16PIN 2MD(073) | [C2765186](https://jlcpcb.com/partdetail/C2765186) | 987,019 | 936,811 |
| TF-01A microSD connector | [C91145](https://jlcpcb.com/partdetail/C91145) | 228,498 | 226,729 |
| Diodes AP2112K-3.3TRG1 | [C51118](https://jlcpcb.com/partdetail/C51118) | 64,877 | 62,523 |
| MT3608 | [C84817](https://jlcpcb.com/partdetail/C84817) | 215,472 | 210,463 |
| PAM8403DR-H | [C17337](https://jlcpcb.com/partdetail/C17337) | 4,345 | 4,319 |
| AOTA-B201610S3R3-101-T inductor | [C42411119](https://jlcpcb.com/partdetail/C42411119) | 13,117 | 12,404 |

The previous LDO listing [C23380830](https://jlcpcb.com/partdetail/C23380830)
identifies **TECH PUBLIC**, not Diodes. It was corrected to C51118 in the GBA
candidate, with the genuine import's footprint/model orientation accounted for.
The pinout is unchanged: 1 VIN, 2 GND, 3 EN, 4 NC, 5 VOUT.
The [Diodes datasheet](https://www.diodes.com/datasheet/download/AP2112.pdf)
applies to the corrected selection; the thermal/load budget still needs signoff.

The other exact-MPN PSRAM entry [C9900003354](https://jlcpcb.com/partdetail/C9900003354)
is a JLC Assembly/consignment-style listing with zero stock and zero available
quantity. It is not a verified immediately orderable replacement. No RAM
substitution or part purchase has been made. All remaining passives/connectors
must also be rechecked against the final assembly BOM before ordering.
