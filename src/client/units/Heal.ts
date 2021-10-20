import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Janitor } from "@rbxts/janitor";

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

	janitor?: Janitor;

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

	janitor: new Janitor(),

	onInitialize: function (this) {
		const model = this.ref;
		const part = model.PrimaryPart!;
		this.janitor?.Add(
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
			}),
		);
	},

	onDestroy: function (this) {
		this.janitor?.Cleanup();
	},
};

export = healPackage;
