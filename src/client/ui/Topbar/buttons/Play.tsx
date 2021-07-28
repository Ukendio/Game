import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import Remotes from "shared/Remotes";
import { getCamera } from "client/core/userCamera";
import ColourScheme from "client/ui/colourScheme";
import Button from "client/ui/components/Button";
import { Players } from "@rbxts/services";
import { Option, Result, UnitType } from "@rbxts/rust-classes";
import { match, __ } from "shared/match";
import Log from "@rbxts/log";

const roundStarted = Remotes.Client.WaitFor("roundStarted");
const deployUser = Remotes.Client.WaitFor("userRequestDeploy");

enum Status {
	Intermission,
	Started,
}

const Play: Hooks.FC = (_, { useState }) => {
	const [status, setStatus] = useState(Status.Intermission);
	const [visibility, setVisibility] = useState(true);
	const [debounce, bounce] = useState(true);

	roundStarted.then((remote) => remote.Connect(() => setStatus(Status.Started)));

	return (
		<Button
			Visible={visibility}
			hoverOff={ColourScheme.Black}
			hoverOn={ColourScheme.Yellow}
			Text="PLAY"
			handler={() => {
				match([status, debounce])
					.with([Status.Started, true], () => {
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

						return Result.ok<UnitType, string>({});
					})
					.with([__, false], () => Result.err<UnitType, string>("debounce expected to be true, but is false"))
					.with([Status.Intermission, __], () => Result.err<UnitType, string>("Game round hasn't started"))
					.with(__, () => Result.err<UnitType, string>("Unexpected Error"))
					.exhaustive()
					.mapErr((errorMessage) => Log.Warn(errorMessage));
			}}
		/>
	);
};

export = new Hooks(Roact)(Play);
