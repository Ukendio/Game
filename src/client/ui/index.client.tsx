import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import Main from "./pages/Main";
import Remotes from "shared/remotes";
import store from "client/core/rodux/store";

Roact.mount(
	<screengui>
		<Main />
	</screengui>,
	Players.LocalPlayer.WaitForChild("PlayerGui"),
);

Remotes.Client.WaitFor("round_started").andThen((r) => {
	r.Connect(() => store.dispatch({ type: "start_round" }));
});
