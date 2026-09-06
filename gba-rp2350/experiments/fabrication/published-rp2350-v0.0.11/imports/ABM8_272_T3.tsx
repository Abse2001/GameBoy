import type { CrystalProps } from "@tscircuit/props";

export const ABM8_272_T3 = (
	props: Omit<CrystalProps, "frequency" | "loadCapacitance" | "pinVariant">,
) => {
	return (
		<crystal
			frequency="12MHz"
			loadCapacitance="10pF"
			pinVariant="four_pin"
			maxTraceLength="10mm"
			supplierPartNumbers={{
				jlcpcb: ["C20625731"],
			}}
			manufacturerPartNumber="ABM8-272-T3"
			footprint={
				<footprint>
					<smtpad
						portHints={["pin1"]}
						pcbX="-1.100074mm"
						pcbY="-0.850011mm"
						width="1.3999972mm"
						height="1.1999976mm"
						shape="rect"
					/>
					<smtpad
						portHints={["pin2"]}
						pcbX="1.100074mm"
						pcbY="-0.850011mm"
						width="1.3999972mm"
						height="1.1999976mm"
						shape="rect"
					/>
					<smtpad
						portHints={["pin3"]}
						pcbX="1.100074mm"
						pcbY="0.850011mm"
						width="1.3999972mm"
						height="1.1999976mm"
						shape="rect"
					/>
					<smtpad
						portHints={["pin4"]}
						pcbX="-1.100074mm"
						pcbY="0.850011mm"
						width="1.3999972mm"
						height="1.1999976mm"
						shape="rect"
					/>
					<silkscreenrect
						pcbX={0}
						pcbY={0}
						width="4.0571928mm"
						height="3.3572196mm"
					/>
				</footprint>
			}
			cadModel={{
				objUrl:
					"https://modelcdn.tscircuit.com/easyeda_models/assets/C20625731.obj?uuid=02485e56ba8d4732a26526d2983fc729",
				stepUrl:
					"https://modelcdn.tscircuit.com/easyeda_models/assets/C20625731.step?uuid=02485e56ba8d4732a26526d2983fc729",
				pcbRotationOffset: 0,
				modelOriginPosition: { x: 0, y: -0.000012700000070253736, z: 0 },
			}}
			{...props}
		/>
	);
};

