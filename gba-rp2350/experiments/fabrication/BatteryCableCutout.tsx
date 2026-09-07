interface BatteryCableCutoutProps {
  pcbX?: number
  pcbY?: number
  width?: number
  height?: number
}

// Mechanical board profile only, not a copper route. Native polygon cutouts
// export on Edge_Cuts. At 12 x 8 mm, 32 segments per semicircle approximate
// the 4 mm end radius with less than 0.005 mm inward chord error.
export const BatteryCableCutout = ({
  pcbX = -18,
  pcbY = -18.5,
  width = 12,
  height = 8,
}: BatteryCableCutoutProps) => {
  if (![pcbX, pcbY, width, height].every(Number.isFinite) || height <= 0 || width <= height) {
    throw new Error("Battery cable cutout requires a finite horizontal capsule with width > height > 0")
  }
  const radius = height / 2
  const halfCenterline = (width - height) / 2
  const segmentsPerSemicircle = 32
  const points = [-1, 1].flatMap(side =>
    Array.from({ length: segmentsPerSemicircle + 1 }, (_, i) => {
      const angle = side * Math.PI / 2 + Math.PI * i / segmentsPerSemicircle
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return {
        x: -side * halfCenterline + radius * (Math.abs(cos) < 1e-12 ? 0 : cos),
        y: radius * (Math.abs(sin) < 1e-12 ? 0 : sin),
      }
    }),
  )
  points.push({ ...points[0]! })
  // Reserve 0.2 mm beyond the slot's bounding box on every copper layer.
  // The rectangle is deliberately conservative around the rounded ends.
  // A fragment preserves the existing board coordinate frame and slot polygon.
  const copperEdgeClearance = 0.2
  return <>
    <cutout name="BATTERY_CABLE_ACCESS" shape="polygon" pcbX={pcbX} pcbY={pcbY} points={points} />
    <keepout
      shape="rect"
      pcbX={pcbX}
      pcbY={pcbY}
      width={width + 2 * copperEdgeClearance}
      height={height + 2 * copperEdgeClearance}
      layers={["top", "inner1", "inner2", "bottom"]}
    />
  </>
}
