import FabricLib, { UnitDefinition } from "@rbxts/fabric";

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
		print("initialize class");
		const abilityHandler = this.getOrCreateUnit("Ability");
		abilityHandler.mergeBaseLayer({});

		const ability1 = this.getOrCreateUnit("WyvernAbility1");
		ability1.mergeBaseLayer({});

		const ability2 = this.getOrCreateUnit("WyvernAbility2");
		ability2.mergeBaseLayer({});

		abilityHandler.bind(ability1.name, () => ability1.execute(), Enum.KeyCode.Q, 5);
		abilityHandler.bind(ability2.name, () => ability2.execute?.(), Enum.KeyCode.E, 5);
	},
};

export = Wyvern;
