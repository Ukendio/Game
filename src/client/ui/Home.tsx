import Roact from "@rbxts/roact";
import Remotes from "shared/Remotes";
import { UserInputService } from "@rbxts/services";
import { getCamera } from "client/core/userCamera";
import Hooks from "@rbxts/roact-hooks";
import Log from "@rbxts/log";
import Topbar from "./Topbar";

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
	const [visibility, setVisibility] = useState(true);

	return (
		<frame Key={"MainFrame"} BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)} Visible={visibility}>
			<Topbar />
		</frame>
	);
};
export = new Hooks(Roact)(home);
