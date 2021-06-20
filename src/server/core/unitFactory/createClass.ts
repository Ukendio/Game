import { Fabric } from "@rbxts/fabric";
import { Events } from "shared/remotes";

const events = Events.server;

export function createHero(fabric: Fabric, player: Player) {
	const wyvernAbilities = fabric.getOrCreateUnitByRef("Wyvern", player);
	wyvernAbilities.mergeBaseLayer({});

	events.unitConstructHero.broadcast(player);
}
