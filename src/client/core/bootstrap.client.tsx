import { StarterPlayer, Players, UserInputService } from "@rbxts/services";
import FabricLib from "@rbxts/fabric";
import Remotes from "shared/remotes";
import Spirit from "shared/Spirit";
import Roact from "@rbxts/roact";
import { RedVignette } from "client/UserInterface/Components/RedVignette";
import yieldForR15CharacterDescendants from "@rbxts/yield-for-character";
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
	Players.LocalPlayer.CameraMode = Enum.CameraMode.LockFirstPerson;
	UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
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

yieldForR15CharacterDescendants(player.Character ?? player.CharacterAdded.Wait()[0]).then((rig) => {
	const handle = Roact.mount(
		<screengui Key={"Main"} IgnoreGuiInset={true} ResetOnSpawn={false}>
			<RedVignette />
		</screengui>,
		playerGui,
	);

	rig.Humanoid.Died.Connect(() => {
		Roact.unmount(handle);
	});

	Roact.mount(
		<screengui Key={"HomeScreen"} IgnoreGuiInset={true} ResetOnSpawn={false}>
			<Home />
		</screengui>,
		playerGui,
	);
});
