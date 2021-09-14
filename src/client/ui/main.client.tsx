import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import Main from "./pages/Main";

Roact.mount(
	<screengui>
		<Main />
	</screengui>,
	Players.LocalPlayer.WaitForChild("PlayerGui"),
);
