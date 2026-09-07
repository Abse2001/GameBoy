/**
 * Clean symmetric PCB envelope for an original AGB-001 housing.
 *
 * The 131.32 x 72.42 mm maximum size is derived from the close-to-1:1
 * OpenTendo-AGB AGB-CPU-01 recreation:
 * https://github.com/Redherring32/OpenTendo-AGB
 *
 * Source license: CC BY-SA 4.0. The original PCB's center cutout and edge
 * tabs are intentionally omitted so the replacement has a regular outline.
 */
export const gbaHousingOutline = [
  { x: -65.66, y: -36.21 },
  { x: 65.66, y: -36.21 },
  { x: 65.66, y: 36.21 },
  { x: -65.66, y: 36.21 },
] as const
