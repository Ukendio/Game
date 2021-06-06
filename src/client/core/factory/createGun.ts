import { Fabric } from "@rbxts/fabric";
import { ConfigurableSettings } from "shared/Types";

export function createGun(fabric: Fabric, gunTool: Tool, settings: ConfigurableSettings) {
	const gun = fabric.getOrCreateUnitByRef("Gun", gunTool);
	gun.mergeBaseLayer({ configurableSettings: settings });
}
