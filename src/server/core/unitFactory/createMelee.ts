import { Fabric } from "@rbxts/fabric";
import { serverEvents } from "shared/remotes";

export function createMelee(fabric: Fabric, player: Player, melee: Tool) {
	const backpack = player.WaitForChild("Backpack");

	melee.Parent = backpack;

	const c = fabric.getOrCreateUnitByRef("Melee", melee);
	c.mergeBaseLayer({});

	serverEvents.unitConstructMelee.fire(player, melee);
}
