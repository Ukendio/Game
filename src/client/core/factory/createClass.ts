import { Fabric } from "@rbxts/fabric";

export function createHero(fabric: Fabric, player: Player) {
	const characterAbilities = fabric.getOrCreateUnitByRef("Wyvern", player);
	characterAbilities.mergeBaseLayer({});
}
