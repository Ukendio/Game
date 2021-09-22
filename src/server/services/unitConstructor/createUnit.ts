import { Fabric, NonNullableObject } from "@rbxts/fabric";
import Unit from "@rbxts/fabric/src/FabricLib/Fabric/Unit";
import { TLayerData } from "shared/Types";

export function createUnit<T extends keyof FabricUnits, R extends Instance | Unit<keyof FabricUnits>>(
	fabric: Fabric,
	unitResolvable: T,
	ref: R,
	defaults: NonNullableObject<TLayerData<T>>,
	unitBuilder: (unit: T, ref: R, layerData: NonNullableObject<TLayerData<T>>) => void,
): string {
	const unit = fabric.getOrCreateUnitByRef(unitResolvable, ref);
	unit.defaults = defaults;
	unitBuilder(unitResolvable, ref, defaults);

	return unitResolvable;
}
