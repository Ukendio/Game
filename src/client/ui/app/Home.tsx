import Roact from "@rbxts/roact";
import Remotes from "shared/Remotes";
import { Players, UserInputService } from "@rbxts/services";
import { getCamera } from "client/core/userCamera";
import Hooks from "@rbxts/roact-hooks";
import { Option } from "@rbxts/rust-classes";
import Log from "@rbxts/log";

const roundStarted = Remotes.Client.WaitFor("roundStarted");
const deployUser = Remotes.Client.WaitFor("userRequestDeploy");

interface Props {}

getCamera()
	.setActorNone()
	.addBlur(1)
	.mapErr((errorMessage) => Log.Warn("{}", errorMessage));

UserInputService.InputChanged.Connect((inputObject) => {
	if (inputObject.UserInputType === Enum.UserInputType.MouseMovement) getCamera().move();
});

const home: Hooks.FC<Props> = (_, { useState }) => {
	const [status, setStatus] = useState("intermission");
	const [visibility, setVisibility] = useState(true);
	const [debounce, bounce] = useState(true);

	roundStarted.then((remote) => remote.Connect(() => setStatus("started")));

	return (
		<frame Key={"MainFrame"} BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)} Visible={visibility}>
			<textbutton
				Key={"DeployButton"}
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundColor3={status === "started" ? new Color3(0, 1, 0) : new Color3(1, 0, 0)}
				BorderSizePixel={0}
				Position={new UDim2(0.5, 0, 0, 0)}
				Size={new UDim2(0.3, 0, 0.1, 0)}
				SizeConstraint={Enum.SizeConstraint.RelativeYY}
				Text={"DEPLOY"}
				TextScaled={true}
				Font={Enum.Font.SourceSansBold}
				Event={{
					MouseButton1Down: () => {
						if (status === "started" && debounce) {
							bounce(true);

							deployUser.then((remote) => {
								remote.CallServerAsync().then((deployed) => {
									if (deployed) {
										setVisibility(false);
									}
								});
							});

							getCamera()
								.setActor(Option.wrap(Players.LocalPlayer.Character))
								.expect("character model is undefined")
								.unwrap()
								.removeBlur();

							Promise.delay(2).then(() => bounce(true));
						}
					},
				}}
			/>
		</frame>
	);
};

export = new Hooks(Roact)(home);
