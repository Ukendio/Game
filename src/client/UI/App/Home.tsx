import Roact from "@rbxts/roact";
import Remotes from "shared/Remotes";
import { Players, UserInputService } from "@rbxts/services";
import Log from "@rbxts/log";
import { getCamera } from "client/core/userCamera";

const roundStarted = Remotes.Client.WaitFor("roundStarted");
const deployUser = Remotes.Client.WaitFor("userRequestDeploy");

interface State {
	status: Color3;
	visible: boolean;
	debounce: boolean;
	mouseConnection: RBXScriptConnection;
}
interface Props {}

export class Home extends Roact.Component<Props, State> {
	state: State = {
		status: new Color3(1, 0, 0),
		visible: true,
		debounce: true,
		mouseConnection: undefined!,
	};

	didMount() {
		roundStarted.then((remote) => {
			Log.Info("round started for client");
			remote.Connect(() => {
				Log.Info("change status ig");
				this.setState({ status: new Color3(0, 1, 0), visible: this.state.visible });
			});
		});

		getCamera().setActorNone().addBlur(1);

		this.setState({
			mouseConnection: UserInputService.InputChanged.Connect((inputObject) => {
				if (inputObject.UserInputType === Enum.UserInputType.MouseMovement) getCamera().move();
			}),
		});
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
						MouseButton1Down: () => {
							if (this.state.debounce) {
								deployUser.then((remote) => {
									remote.CallServerAsync().then((deployed: boolean | Model) => {
										if (
											deployed !== false &&
											typeIs(deployed, "Instance") &&
											deployed.IsA("Model")
										) {
											getCamera().removeBlur().setActor(deployed);

											Players.LocalPlayer.CameraMode = Enum.CameraMode.LockFirstPerson;
											UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;

											this.state.mouseConnection.Disconnect();

											this.setState({
												status: this.state.status,
												visible: false,
												debounce: false,
												mouseConnection: undefined!,
											});
										}
									});
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
