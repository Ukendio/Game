import Roact from "@rbxts/roact";
import { Players, RunService } from "@rbxts/services";

const player = Players.LocalPlayer;

function facingDirection(source: BasePart, target: Vector3) {
	const lookVector = source.CFrame.LookVector;
	const r = target.sub(source.Position).Unit;
	return -math.deg(math.acos(lookVector.Dot(r))) * math.sign(lookVector.Cross(r).Y);
}

interface State {
	rotation: number;
	connection: RBXScriptConnection;
}
interface Props {
	source: Model | undefined;
	visible: boolean;
}

export class Indicator extends Roact.Component<Props, State> {
	state = {
		rotation: 0,
		connection: (undefined as unknown) as RBXScriptConnection,
	};

	didMount() {
		const humanoidRootPart = player.Character?.WaitForChild("HumanoidRootPart") as BasePart;

		if (this.props.source !== undefined) {
			const source = this.props.source.PrimaryPart as BasePart;
			let current = humanoidRootPart.Position.Dot(source.Position);
			this.state.connection = RunService.Heartbeat.Connect(() => {
				if (current !== humanoidRootPart.Position.Dot(source.Position)) {
					current = humanoidRootPart.Position.Dot(source.Position);

					this.setState(() => {
						return { rotation: facingDirection(humanoidRootPart, source.Position) };
					});
				}
			});
		}
	}

	render(): Roact.Element {
		return (
			<imagelabel
				Key={"Indicator"}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={UDim2.fromOffset(400, 400)}
				BackgroundTransparency={1}
				ImageTransparency={0}
				Image={"rbxassetid://6693850487"}
				Rotation={this.state.rotation}
				ImageColor3={new Color3(1, 0, 0)}
				Visible={this.props.visible}
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
	}

	willUnmount() {
		this.state.connection.Disconnect();
		this.state.connection = (undefined as unknown) as RBXScriptConnection;
	}
}
