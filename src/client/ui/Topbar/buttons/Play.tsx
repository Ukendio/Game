import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import Remotes from "shared/Remotes";
import { getCamera } from "client/core/userCamera";
import ColourScheme from "client/ui/colourScheme";
import Button from "client/ui/components/Button";
import { Players } from "@rbxts/services";
import { Option } from "@rbxts/rust-classes";

const roundStarted = Remotes.Client.WaitFor("roundStarted");
const deployUser = Remotes.Client.WaitFor("userRequestDeploy");

const Play: Hooks.FC = (_, { useState }) => {
	const [status, setStatus] = useState("intermission");
	const [visibility, setVisibility] = useState(true);
	const [debounce, bounce] = useState(true);

	roundStarted.then((remote) => remote.Connect(() => setStatus("started")));

	return (
		<Button
			hoverOff={ColourScheme.Black}
			hoverOn={ColourScheme.Yellow}
			Text="PLAY"
			handler={() => {
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
			}}
		/>
	);
};

export = new Hooks(Roact)(Play);
