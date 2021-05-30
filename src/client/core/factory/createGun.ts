import { Fabric } from "@rbxts/fabric";

export function createGun(fabric: Fabric, gunTool: Tool) {
	const gun = fabric.getOrCreateUnitByRef("Gun", gunTool);
	gun.mergeBaseLayer({});
}
