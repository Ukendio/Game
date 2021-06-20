import { Fabric } from "@rbxts/fabric";
import { serverEvents } from "shared/remotes";

export function createHero(fabric: Fabric, player: Player) {
	const wyvernAbilities = fabric.getOrCreateUnitByRef("Wyvern", player);
	wyvernAbilities.mergeBaseLayer({});

	serverEvents.unitConstructHero.broadcast(player);
}
