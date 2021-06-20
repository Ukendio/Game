import { Fabric } from "@rbxts/fabric";
import { Events } from "shared/remotes";

const events = Events.server;

export function createMelee(fabric: Fabric, player: Player, melee: Tool) {
	const backpack = player.WaitForChild("Backpack");

	melee.Parent = backpack;

	const c = fabric.getOrCreateUnitByRef("Melee", melee);
	c.mergeBaseLayer({});

	events.unitConstructMelee.fire(player, melee);
}
