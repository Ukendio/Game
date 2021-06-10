import { UnitDefinition } from "@rbxts/fabric";

declare global {
	interface FabricUnits {
		Wyvern: WyvernDefinition;
	}
}

interface WyvernDefinition extends UnitDefinition<"Wyvern"> {
	name: "Wyvern";
	ref?: Player;

	units: {
		Replicated: {};
		WyvernAbility1?: {
			host: Instance | undefined;
			velocity: Vector3;
			maxForce: Vector3;
		};
		WyvernAbility2: {
			root?: CFrame;
			name?: string | undefined;
		};
	};
}

const Wyvern: WyvernDefinition = {
	name: "Wyvern",

	units: {
		Replicated: {},
		WyvernAbility1: {
			host: undefined,
			velocity: new Vector3(),
			maxForce: new Vector3(),
		},
		WyvernAbility2: {},
	},

	onInitialize: function (this) {
		const abilityHandler = this.getUnit("Ability")!;
		const ability1 = abilityHandler.getUnit("WyvernAbility1")!;
		const ability2 = abilityHandler.getUnit("WyvernAbility2")!;

		abilityHandler.bind(ability1.name, () => ability1.execute(), Enum.KeyCode.Q, 5);
		abilityHandler.bind(ability2.name, () => ability2.execute?.(), Enum.KeyCode.E, 5);
	},
};

export = Wyvern;
