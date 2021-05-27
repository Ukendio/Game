import Roact from "@rbxts/roact";
import Remotes from "shared/remotes";
import UserCamera from "client/UserInterface/Components/camera";

const DeployUser = Remotes.Client.Get("ClientRequestDeploy");
const RoundStarted = Remotes.Client.Get("RoundStarted");

interface State {
	status: Color3;
	visible: boolean;
	debounce: boolean;
}
interface Props {}

export class Home extends Roact.Component<Props, State> {
	state: State = {
		status: new Color3(1, 0, 0),
		visible: true,
		debounce: true,
	};

	didMount() {
		RoundStarted.Connect(() => this.setState({ status: new Color3(0, 1, 0), visible: this.state.visible }));
	}

	render(): Roact.Element {
		return (
			<frame
				Key={"MainFrame"}
				BackgroundTransparency={1}
				Size={new UDim2(1, 0, 1, 0)}
				Visible={this.state.visible}
			>
				<textbutton
					Key={"DeployButton"}
					AnchorPoint={new Vector2(0.5, 0)}
					BackgroundColor3={this.state.status}
					BorderSizePixel={0}
					Position={new UDim2(0.5, 0, 0, 0)}
					Size={new UDim2(0.3, 0, 0.1, 0)}
					SizeConstraint={Enum.SizeConstraint.RelativeYY}
					Text={"DEPLOY"}
					TextScaled={true}
					Font={Enum.Font.SourceSansBold}
					Event={{
						MouseButton1Down: (rbx, x, y) => {
							if (this.state.debounce) {
								this.setState({
									status: this.state.status,
									visible: this.state.visible,
									debounce: false,
								});
								DeployUser.CallServerAsync().then((deployed: boolean | Model) => {
									if (deployed === false) return;

									UserCamera.removeBlur();
									this.setState({ status: this.state.status, visible: false });
								});

								Promise.delay(1).then(() =>
									this.setState({
										status: this.state.status,
										visible: this.state.visible,
										debounce: true,
									}),
								);
							}
						},
					}}
				/>
			</frame>
		);
	}
}
