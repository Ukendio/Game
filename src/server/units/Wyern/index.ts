import { UnitDefinition } from "@rbxts/fabric";

declare global {
	interface FabricUnits {
		Wyvern: WyvernDefinition;
	}
}

interface WyvernDefinition extends UnitDefinition<"Wyvern"> {
	name: "Wyvern";
	ref?: Player;
}

const Wyvern: WyvernDefinition = {
	name: "Wyvern",

	onInitialize: function (this) {
		this.fabric.registerUnitsIn(script);

		const ability2 = this.getOrCreateUnit("WyvernAbility2");
		ability2.mergeBaseLayer({});
	},
};

export = Wyvern;
