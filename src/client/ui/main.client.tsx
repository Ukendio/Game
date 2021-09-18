import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import Main from "./pages/Main";
import Remotes from "shared/remotes";
import store from "client/core/rodux/store";

const round_started = Remotes.Client.WaitFor("round_started");

Roact.mount(
	<screengui>
		<Main />
	</screengui>,
	Players.LocalPlayer.WaitForChild("PlayerGui"),
);

round_started.then((a) => {
	a.Connect(() => {
		store.dispatch({ type: "start_round" });
	});
});
