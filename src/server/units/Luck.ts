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

	applyLuck: function (this, layerData) {
		const rng = math.random(0, layerData);
		if (rng < 25) {
			return layerData;
		}

		return 0;
	},
};

export = Luck;
