import { Fabric } from "@rbxts/fabric";
import { ReplicatedStorage } from "@rbxts/services";
import Mode from "shared/Mode";
import Remotes from "shared/remotes";

const ServerCreateGun = Remotes.Server.Create("ServerCreateGun");

export interface ConfigurableSettings {
	fireRate: number;
	recoil: number;
	maxDistance: number;
	mode: Mode;
}

export function createGun(fabric: Fabric, player: Player, settings?: ConfigurableSettings) {
	const backpack = player.WaitForChild("Backpack");

	const gunTool = ReplicatedStorage.TS.assets.FindFirstChild("Pistol")?.Clone() as Tool;
	gunTool.Parent = backpack;

	const gun = fabric.getOrCreateUnitByRef("Gun", gunTool);
	gun.mergeBaseLayer({ configurableSettings: settings });

	ServerCreateGun.SendToPlayer(player, gunTool);
	print("hell yeah");
}
