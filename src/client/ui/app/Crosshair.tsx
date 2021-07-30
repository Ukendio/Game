import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import Flipper from "@rbxts/flipper";
import Outline from "client/ui/components/Outline";
import { match } from "@rbxts/rbxts-pattern";
import Yessir from "@rbxts/yessir";

interface Props {
	signal: Yessir;
	offset: number;
	fireRate: number;
	recoil: number;
}

const recoilOnClick: Hooks.FC<Props> = (props, { useCallback }) => {
	const motor = new Flipper.SingleMotor(0);
	const [binding, setBinding] = Roact.createBinding(motor.getValue());
	const newBinding = binding;
	motor.onStep(setBinding);

	const doRecoil = useCallback(() => {
		motor.setGoal(
			new Flipper.Spring(1, {
				frequency: 10,
				dampingRatio: 1,
			}),
		);

		Promise.delay(0.075).then(() => {
			motor.setGoal(
				new Flipper.Spring(0, {
					frequency: 4,
					dampingRatio: 0.75,
				}),
			);
		});
	});

	props.signal.setup(() => doRecoil());

	const layers = ["Inner", "Outer"] as const;
	const directions = ["Up", "Down", "Left", "Right"] as const;
	const innerOutlines = new Array<Roact.Element>();
	const outerOutlines = new Array<Roact.Element>();

	for (const layer of layers) {
		for (const direction of directions) {
			const outline = <Outline name={direction} layer={layer} />;
			match(layer)
				.with("Outer", () => outerOutlines.push(outline))
				.with("Inner", () => innerOutlines.push(outline))
				.run();
		}
	}

	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			Position={new UDim2(0.5, 0, 0, props.offset)}
			Size={new UDim2(0, 100, 0, 100)}
			ZIndex={0}
		>
			<frame
				Key="CenterPoint"
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BorderSizePixel={0}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(0, 3, 0, 3)}
				ZIndex={20}
			/>
			<frame
				Key="Outer"
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={newBinding.map((value) =>
					new UDim2(0.5, 0, 0.3, 0).Lerp(new UDim2(0.5, 0, props.recoil, 0), value),
				)}
				ZIndex={20}
			>
				{...outerOutlines}
				<uiaspectratioconstraint DominantAxis={Enum.DominantAxis.Height} AspectType="ScaleWithParentSize" />
			</frame>
			<frame
				Key="Inner"
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(0.3, 0, 0.3, 0)}
				ZIndex={10}
			>
				{...innerOutlines}
			</frame>
		</frame>
	);
};

export = new Hooks(Roact)(recoilOnClick, {
	defaultProps: {},
});
