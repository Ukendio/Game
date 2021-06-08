import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";

declare global {
	interface FabricUnits {
		Heal: HealPackage;
	}
}
interface HealPackage extends UnitDefinition<"Heal"> {
	name: "Heal";

	ref?: Model;

	units: {
		Replicated: {};
	};

	defaults?: {
		debounce: boolean;
		target: Humanoid | undefined;
		heal: number;
		transparency: number;
		particle: boolean;
	};

	particle?: ParticleEmitter;

	connection?: RBXScriptConnection;

	onClientHeal?: (this: ThisFabricUnit<"Heal">, _player: Player, amount: number) => void;
}

const healPackage: HealPackage = {
	name: "Heal",

	units: {
		Replicated: {},
	},

	defaults: {
		debounce: true,
		target: undefined,
		heal: 0,
		transparency: 0,
		particle: true,
	},

	onInitialize: function (this) {
		const model = this.ref as Model;
		const part = model.PrimaryPart!;
		part.Touched.Connect((hit) => {
			if (hit.Parent?.FindFirstChild("Humanoid")) {
				const amount = math.random(10, 50);
				this.getUnit("Transmitter")!.sendWithPredictiveLayer(
					{
						transparency: 1,
						heal: amount,
					},
					"heal",
					amount,
				);
			}
		});
	},
};

export = healPackage;
