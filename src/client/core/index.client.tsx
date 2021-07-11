import { Flamework } from "@rbxts/flamework";

import { Players, StarterGui } from "@rbxts/services";
import Roact from "@rbxts/roact";
import { Home } from "client/ui/app/home";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui");

StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.PlayerList, false);

Roact.mount(
	<screengui Key={"HomeScreen"} IgnoreGuiInset={true} ResetOnSpawn={false}>
		<Home />
	</screengui>,
	playerGui,
);

Flamework.addPaths("src/client/controllers");
Flamework.ignite();
