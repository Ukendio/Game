import FabricLib, { Fabric, ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";

declare global {
	interface FabricUnits {
		Luck: LuckDefinition;
	}
}
interface LuckDefinition extends UnitDefinition<"Luck"> {
	name: "Luck";

	units: {
		Replicated: {};
	};

	defaults?: {
		debounce: true;
	};

	ref?: ThisFabricUnit<keyof FabricUnits>;

	applyLuck?: (this: ThisFabricUnit<"Luck">, layerData: number) => void;
}

const Luck: LuckDefinition = {
	name: "Luck",

	units: {
		Replicated: {},
	},

	onInitialize: function (this) {},
};

export = Luck;
