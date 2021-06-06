import { Fabric } from "@rbxts/fabric";
import { ReplicatedStorage } from "@rbxts/services";
import { ConfigurableSettings } from "shared/Types";
import Remotes from "shared/remotes";

const ServerCreateGun = Remotes.Server.Create("ServerCreateGun");

export function createGun(fabric: Fabric, player: Player, settings: ConfigurableSettings) {
	const backpack = player.WaitForChild("Backpack");

	const gunTool = ReplicatedStorage.TS.assets.FindFirstChild("Pistol")?.Clone() as Tool;
	gunTool.Parent = backpack;

	const gun = fabric.getOrCreateUnitByRef("Gun", gunTool);
	gun.mergeBaseLayer({ configurableSettings: settings });

	ServerCreateGun.SendToPlayer(player, gunTool, settings);
}
