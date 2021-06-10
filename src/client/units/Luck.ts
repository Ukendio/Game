import FabricLib, { Fabric, ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";

declare global {
	interface FabricUnits {
		Luck: LuckDefinition;
	}
}

interface LuckDefinition extends UnitDefinition<"Luck"> {
	name: "Luck";

	ref?: ThisFabricUnit<keyof FabricUnits>;

	defaults?: {
		foo: string;
	};

	applyLuck: (this: ThisFabricUnit<"Luck">, layerData: number) => string;
}

const Luck: LuckDefinition = {
	name: "Luck",

	onInitialize: function (this) {
		//MAKE SURE THIS PRINTS BAR
		print(this.get("foo"));
	},

	applyLuck: function (this, layerData) {
		const rng = math.random(0, layerData);
		if (rng < 25) {
			return tostring(layerData);
		}

		return "Miss";
	},
};

export = Luck;
