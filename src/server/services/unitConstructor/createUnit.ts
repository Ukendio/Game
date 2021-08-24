import { Fabric, NonNullableObject } from "@rbxts/fabric";
import Unit from "@rbxts/fabric/src/FabricLib/Fabric/Unit";
import { Result } from "@rbxts/rust-classes";
import { TLayerData } from "shared/Types";

export function createUnit<T extends keyof FabricUnits, R extends Instance | Unit<keyof FabricUnits>>(
	fabric: Fabric,
	unitResolvable: T,
	ref: R,
	layerData: NonNullableObject<TLayerData<T>>,
	unitBuilder: (unit: T, ref: R, layerData: NonNullableObject<TLayerData<T>>) => void,
): string {
	const unit = fabric.getOrCreateUnitByRef(unitResolvable, ref);
	unit.mergeBaseLayer(layerData);
	unitBuilder(unitResolvable, ref, layerData);

	return unitResolvable;
}
