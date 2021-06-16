import { Fabric } from "@rbxts/fabric";
import { ReplicatedStorage } from "@rbxts/services";
import { Config } from "shared/Types";
import Remotes from "shared/remotes";

const ServerCreateGun = Remotes.Server.Create("ServerCreateGun");

export function createGun(fabric: Fabric, player: Player, settings: Config) {
	const backpack = player.WaitForChild("Backpack");

	const gunTool = ReplicatedStorage.assets.FindFirstChild("Pistol")?.Clone() as Tool;
	gunTool.Parent = backpack;

	const gun = fabric.getOrCreateUnitByRef("Gun", gunTool);
	gun.mergeBaseLayer({ configurableSettings: settings });

	ServerCreateGun.SendToPlayer(player, gunTool, settings);
}
