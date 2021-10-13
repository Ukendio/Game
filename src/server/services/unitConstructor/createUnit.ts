import { Fabric, NonNullableObject, UnitDefinition } from "@rbxts/fabric";
import { TLayerData } from "shared/Types";

export function createUnit<T extends keyof FabricUnits, R extends Instance | UnitDefinition<keyof FabricUnits>>(
	fabric: Fabric,
	unitResolvable: T,
	ref: R,
	defaults: NonNullableObject<TLayerData<T>>,
	unitBuilder: (unit: T, ref: R, layerData: NonNullableObject<TLayerData<T>>) => void,
): T {
	const unit = fabric.getOrCreateUnitByRef(unitResolvable, ref);
	unit.defaults = defaults;
	unitBuilder(unitResolvable, ref, defaults);

	return unitResolvable;
}
