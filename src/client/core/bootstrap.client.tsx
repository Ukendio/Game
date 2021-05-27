import { StarterPlayer, Players } from "@rbxts/services";
import FabricLib from "@rbxts/fabric";
import Remotes from "shared/remotes";
import Spirit from "shared/Spirit";
import Roact from "@rbxts/roact";
import { Home } from "client/UserInterface/App/Home";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui");

const fabric = new FabricLib.Fabric("Example");
{
	fabric.DEBUG = true;
	FabricLib.useReplication(fabric);
	FabricLib.useTags(fabric);
	FabricLib.useBatching(fabric);
	fabric.registerUnitsIn(StarterPlayer.StarterPlayerScripts.TS.units);
}

const ServerCreateHealthPack = Remotes.Client.Get("ServerCreateHealthPack");

ServerCreateHealthPack.Connect((healthPack) => {
	const c = fabric.getOrCreateUnitByRef("Heal", healthPack);
	c.mergeBaseLayer({});
});

const gunTool = Players.LocalPlayer.WaitForChild("Backpack").WaitForChild("Pistol");
const gun = fabric.getOrCreateUnitByRef("Gun", gunTool);
gun.mergeBaseLayer({});

Spirit.bind(Enum.KeyCode.M);

Roact.mount(
	<screengui Key={"HomeScreen"} IgnoreGuiInset={true} ResetOnSpawn={false}>
		<Home />
	</screengui>,
	playerGui,
);
