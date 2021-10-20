import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import { Players, RunService } from "@rbxts/services";

const player = Players.LocalPlayer;

function facingDirection(source: BasePart, target: Vector3): number {
	const lookVector = source.CFrame.LookVector;
	const r = target.sub(source.Position).Unit;
	return -math.deg(math.acos(lookVector.Dot(r))) * math.sign(lookVector.Cross(r).Y);
}

interface Props {
	source: Model | undefined;
	visible: boolean;
}

const indicator: Hooks.FC<Props> = (props, { useState }) => {
	const [rotation, setRotation] = useState(0);

	if (props.source) {
		const source = props.source.PrimaryPart as Part;
		const humanoidRootPart = player.Character?.WaitForChild("HumanoidRootPart") as BasePart;
		let previousAngle = humanoidRootPart.Position.Dot(source.Position);

		RunService.Heartbeat.Connect(() => {
			const current = humanoidRootPart.Position.Dot(source.Position);

			if (previousAngle !== current) {
				previousAngle = current;
			}

			setRotation(facingDirection(humanoidRootPart, source.Position));
		});
	}
	return (
		<imagelabel
			Key={"Indicator"}
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Size={UDim2.fromOffset(400, 400)}
			BackgroundTransparency={1}
			ImageTransparency={0}
			Image={"rbxassetid://6693850487"}
			Rotation={rotation}
			ImageColor3={new Color3(1, 0, 0)}
			Visible={props.visible}
		>
			<uigradient
				Key={"Gradient"}
				Rotation={90}
				Transparency={
					new NumberSequence([
						new NumberSequenceKeypoint(0, 0),
						new NumberSequenceKeypoint(0.0875, 0),
						new NumberSequenceKeypoint(0.125, 0.0625),
						new NumberSequenceKeypoint(0.14, 0.206),
						new NumberSequenceKeypoint(0.152, 0.538),
						new NumberSequenceKeypoint(0.164, 1),
						new NumberSequenceKeypoint(1, 1),
					])
				}
			/>
		</imagelabel>
	);
};

export = new Hooks(Roact)(indicator, {
	defaultProps: {
		visible: true,
	},
});
