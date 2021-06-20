import { Fabric } from "@rbxts/fabric";
import { ReplicatedStorage } from "@rbxts/services";
import { Config } from "shared/Types";
import { Events } from "shared/remotes";

const events = Events.server;

export function createGun(fabric: Fabric, player: Player, settings: Config) {
	const backpack = player.WaitForChild("Backpack");

	const gunTool = ReplicatedStorage.assets.FindFirstChild("Pistol")?.Clone() as Tool;
	gunTool.Parent = backpack;

	const gun = fabric.getOrCreateUnitByRef("Gun", gunTool);
	gun.mergeBaseLayer({ configurableSettings: settings });

	events.unitConstructGun.fire(player, gunTool, settings);
}
