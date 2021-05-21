import { StarterPlayer, Workspace, Players } from "@rbxts/services";
import FabricLib from "@rbxts/fabric";
import Remotes from "shared/Remotes";
import Spirit from "shared/Spirit";

const fabric = new FabricLib.Fabric("Example");
fabric.DEBUG = false;
FabricLib.useReplication(fabric);
FabricLib.useTags(fabric);
FabricLib.useBatching(fabric);

fabric.registerUnitsIn(StarterPlayer.StarterPlayerScripts.TS.units);

const ServerCreateHealthPack = Remotes.Client.Get("ServerCreateHealthPack");
ServerCreateHealthPack.Connect((healthPack) => {
	const c = fabric.getOrCreateUnitByRef("Heal", healthPack);
	c.mergeBaseLayer({});
});

Players.LocalPlayer.CharacterAdded.Wait();
const gunTool = Players.LocalPlayer.WaitForChild("Backpack").WaitForChild("GunTool");
const gun = fabric.getOrCreateUnitByRef("Gun", gunTool);
gun.mergeBaseLayer({});

Spirit.bind(Enum.KeyCode.M);
