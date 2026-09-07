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

// Keep broad top-layer fill away from the membrane-contact fields. Their
// exposed electrodes and autorouted connections remain; bottom/inner ground
// can still serve as the return plane. Do not fill gaps between button lobes.
export const gbaHousingTopGroundOutline = [
  { x: -65.41, y: -35.96 },
  { x: 65.41, y: -35.96 },
  { x: 65.41, y: -2 },
  { x: 42, y: -2 },
  { x: 42, y: 13 },
  { x: 65.41, y: 13 },
  { x: 65.41, y: 35.96 },
  { x: -65.41, y: 35.96 },
  { x: -65.41, y: 20 },
  { x: -39, y: 20 },
  { x: -39, y: -27 },
  { x: -65.41, y: -27 },
] as const
