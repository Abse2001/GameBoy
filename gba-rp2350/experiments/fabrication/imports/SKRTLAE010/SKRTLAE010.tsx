import objPath from "./SKRTLAE010.obj"
import stepPath from "./SKRTLAE010.step"
import type { PushButtonProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["CONTACT_A"],
  pin2: ["CONTACT_B"],
  pin3: ["CONTACT_A_DUP"],
  pin4: ["MOUNT_1"],
  pin5: ["MOUNT_2"]
} as const

export const SKRTLAE010 = (props: PushButtonProps<typeof pinLabels>) => {
  const { name = "SW1", ...restProps } = props

  return (
    <pushbutton
      name={name}
      // Alps SKRT circuit diagram: 1 and 3 are permanently common; 2 is
      // the other normally-open contact. The two hold-down tabs are not
      // identified as electrical contacts in the manufacturer's diagram.
      internallyConnectedPins={[["pin1", "pin3"]]}
      noConnect={["pin4", "pin5"]}
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C110293"
  ]
}}
      manufacturerPartNumber="SKRTLAE010"
      footprint={<footprint>
        {/* Conservative rectangular envelope of Alps' hatched mounting-face
            copper-track prohibition. Actual terminals remain outside it.
            At pcbRotation=180 this becomes x +/-1.2, y +0.15..+1.65.
            See VERIFICATION.md; actuator faces -Y at pcbRotation=0. */}
        <keepout shape="rect" pcbX={0} pcbY={-0.9} width={2.4} height={1.5}
          layers={["top"]} excludeRefs={[`.${name}`]} />
        <hole pcbX="2.1250021mm" pcbY="-0.14998065mm" diameter="0.9000236mm" />
<hole pcbX="-2.1250021mm" pcbY="-0.14998065mm" diameter="0.9000236mm" />
<smtpad portHints={["pin1"]} pcbX="-1.2250039mm" pcbY="0.74999215mm" width="0.7500112mm" height="1.7999964mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="0.0147447mm" pcbY="0.74999215mm" width="0.599948mm" height="1.7999964mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="1.2250039mm" pcbY="0.74999215mm" width="0.7500112mm" height="1.7999964mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-1.8499963mm" pcbY="-1.19999125mm" width="1.2999974mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="1.8499963mm" pcbY="-1.19999125mm" width="1.2999974mm" height="0.8999982mm" shape="rect" />
<silkscreenpath route={[{"x":-0.9999853000000059,"y":-1.350003650000005},{"x":1.0000107000000042,"y":-1.350003650000005}]} />
<silkscreenpath route={[{"x":1.073619899999997,"y":-1.350003650000005},{"x":1.0000107000000042,"y":-1.350003650000005},{"x":1.0000107000000042,"y":-2.1900070500000055},{"x":-0.9999853000000059,"y":-2.1900070500000055},{"x":-0.9999853000000059,"y":-1.350003650000005},{"x":-1.0735944999999987,"y":-1.350003650000005}]} />
<silkscreenpath route={[{"x":2.2500208999999955,"y":1.2099861499999918},{"x":2.2500208999999955,"y":0.4286313500000034}]} />
<silkscreenpath route={[{"x":-1.7412080999999944,"y":1.2099861499999918},{"x":-2.2499700999999988,"y":1.2099861499999918},{"x":-2.2499700999999988,"y":0.4286313500000034}]} />
<silkscreenpath route={[{"x":-0.4653660999999971,"y":1.2099861499999918},{"x":-0.6311264999999935,"y":1.2099861499999918}]} />
<silkscreenpath route={[{"x":0.6606158999999963,"y":1.2099861499999918},{"x":0.4948554999999999,"y":1.2099861499999918}]} />
<silkscreenpath route={[{"x":2.2500208999999955,"y":1.2099861499999918},{"x":1.7706975000000114,"y":1.2099861499999918}]} />
<silkscreentext text="{NAME}" pcbX="-0.0048387mm" pcbY="2.65984555mm" anchorAlignment="center" fontSize="1mm" />
<fabricationnotepath route={[{"x":1.999983300000011,"y":-0.5000180500000084},{"x":1.999983300000011,"y":0.19998054999999226},{"x":2.2499955000000114,"y":0.19998054999999226},{"x":2.2499955000000114,"y":-0.5000180500000084},{"x":1.999983300000011,"y":-0.5000180500000084}]} strokeWidth="0.254mm" />
<fabricationnotepath route={[{"x":-2.249995499999997,"y":-0.5000180500000084},{"x":-2.249995499999997,"y":0.19998054999999226},{"x":-1.9999832999999967,"y":0.19998054999999226},{"x":-1.9999832999999967,"y":-0.5000180500000084},{"x":-2.249995499999997,"y":-0.5000180500000084}]} strokeWidth="0.254mm" />
<fabricationnotepath route={[{"x":-1.0499724999999955,"y":-1.2749974500000008},{"x":-1.0499724999999955,"y":-2.2250336500000003},{"x":-1.0499724999999955,"y":-2.225008250000002},{"x":1.00001069999999,"y":-2.225008250000002},{"x":1.0500232999999923,"y":-2.225008250000002},{"x":1.0500232999999923,"y":-1.2749974500000008},{"x":0.9499980999999877,"y":-1.2749974500000008},{"x":0.9499980999999877,"y":-2.1250084499999957},{"x":-0.9499727000000036,"y":-2.1250084499999957},{"x":-0.9499727000000036,"y":-1.2749974500000008},{"x":-1.0499724999999955,"y":-1.2749974500000008}]} strokeWidth="0.254mm" />
<courtyardoutline outline={[{"x":-3.0869387000000046,"y":1.90984555},{"x":3.0772613000000035,"y":1.90984555},{"x":3.0772613000000035,"y":-2.4763544500000165},{"x":-3.0869387000000046,"y":-2.4763544500000165},{"x":-3.0869387000000046,"y":1.90984555}]} />
      </footprint>}
      cadModel={{
        objUrl: objPath,
        stepUrl: stepPath,
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.0018626000000014908, y: 0.15200194999999506, z: 0.04999899999999996 },
      }}
      {...restProps}
    />
  )
}
