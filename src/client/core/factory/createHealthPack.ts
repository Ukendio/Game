import { Fabric } from "@rbxts/fabric";

export function createHealthPack(fabric: Fabric, healthPack: Model) {
	const c = fabric.getOrCreateUnitByRef("Heal", healthPack);
	c.mergeBaseLayer({});
}
