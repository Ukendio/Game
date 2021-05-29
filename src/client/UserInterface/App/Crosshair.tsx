import Roact from "@rbxts/roact";
import Outline from "client/UserInterface/Components/Outline";

import Flipper from "@rbxts/flipper";
import { Players } from "@rbxts/services";
import Signal from "shared/dispatcher";

const player = Players.LocalPlayer;
const mouse = player.GetMouse();

interface Props {
	signal: Signal;
	mouseOffset: number;
	fireRate: number;
	recoil: number;
}

export class Crosshair extends Roact.Component<Props> {
	private _motor = new Flipper.SingleMotor(0);
	private _binding;

	constructor(props: Props) {
		super({
			signal: props.signal,
			mouseOffset: props.mouseOffset,
			fireRate: props.fireRate,
			recoil: props.recoil,
		});
		const [binding, setBinding] = Roact.createBinding(this._motor.getValue());
		this._binding = binding;
		this._motor.onStep(setBinding);
	}

	didMount() {
		this.props.signal.connect(() => {
			this._motor.setGoal(
				new Flipper.Spring(1, {
					frequency: 10,
					dampingRatio: 1,
				}),
			);

			Promise.delay(0.075).then(() => {
				this._motor.setGoal(
					new Flipper.Spring(0, {
						frequency: 4,
						dampingRatio: 0.75,
					}),
				);
			});
		});
	}
	render() {
		return (
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={new UDim2(0.5, 0, 0, this.props.mouseOffset)}
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
					Size={this._binding.map((value) =>
						new UDim2(0.5, 0, 0.3, 0).Lerp(new UDim2(0.5, 0, this.props.recoil, 0), value),
					)}
					ZIndex={20}
				>
					<Outline name="Up" layer="Outer" />
					<Outline name="Down" layer="Outer" />
					<Outline name="Left" layer="Outer" />
					<Outline name="Right" layer="Outer" />
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
					<Outline name="Up" layer="Inner" />
					<Outline name="Down" layer="Inner" />
					<Outline name="Left" layer="Inner" />
					<Outline name="Right" layer="Inner" />
				</frame>
			</frame>
		);
	}
}
