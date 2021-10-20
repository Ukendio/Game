import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import MainButton from "../components/MainButton";
import Remotes from "shared/Remotes";
import store from "client/core/rodux/store";
import { Sequence } from "shared/Types";

const user_request_deploy = Remotes.Client.WaitFor("userRequestDeploy");

interface Props {}

const Main: Hooks.FC<Props> = (_, { useState }) => {
	const [visibility, set_visibility] = useState(true);

	return (
		<frame
			AnchorPoint={new Vector2(0, 0.5)}
			Position={new UDim2(0, 100, 0.5, 0)}
			Size={UDim2.fromOffset(400, 250)}
			Visible={visibility}
			BackgroundTransparency={1}
		>
			<uilistlayout Padding={new UDim(0, 15)} FillDirection="Vertical" />
			<MainButton
				name="Deploy"
				icon=""
				f={(): void => {
					print("safe guard");
					if (store.getState().round.sequence === Sequence.Intermission) return;

					user_request_deploy.then((a) => a.SendToServer()).catch((reason) => warn(reason));

					set_visibility(false);
				}}
			/>
			<MainButton name="Store" />
			<MainButton name="Locker" />
		</frame>
	);
};

export = new Hooks(Roact)(Main);
