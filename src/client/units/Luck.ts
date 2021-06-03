import FabricLib, { Fabric, ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";

declare global {
	interface FabricUnits {
		Luck: LuckDefinition;
	}
}

interface LuckDefinition extends UnitDefinition<"Luck"> {
	name: "Luck";

	defaults?: {
		debounce: true;
	};

	ref?: ThisFabricUnit<keyof FabricUnits>;

	applyLuck: (this: ThisFabricUnit<"Luck">, layerData: number) => string;
}

const Luck: LuckDefinition = {
	name: "Luck",

	onInitialize: function (this) {
		print("initialize");
	},

	applyLuck: function (this, layerData) {
		print(layerData);
		const rng = math.random(0, layerData);
		print(rng);
		if (rng < 25) {
			return tostring(layerData);
		}

		return "Miss";
	},
};

export = Luck;
