import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Players, Workspace } from "@rbxts/services";

declare global {
	interface FabricUnits {
		WyvernAbility2: WyvernAbility2Definition;
	}
}

interface WyvernAbility2Definition extends UnitDefinition<"WyvernAbility2"> {
	name: "WyvernAbility2";

	units: {
		Replicated: {};
	};

	defaults?: {
		root?: CFrame;
		name?: string | undefined;
	};

	execute?: (this: ThisFabricUnit<"WyvernAbility2">) => void;

	onClientExecute?: (this: ThisFabricUnit<"Ability">, _player: Player, root: CFrame) => void;
}

const player = Players.LocalPlayer;

const wyvernAbility1: WyvernAbility2Definition = {
	name: "WyvernAbility2",

	units: {
		Replicated: {},
	},

	execute: function (this) {
		const character = player.Character;
		const humanoidRootPart = character?.FindFirstChild("HumanoidRootPart") as BasePart;

		if (character && humanoidRootPart) {
			this.getUnit("Transmitter")!.sendWithPredictiveLayer(
				{
					root: humanoidRootPart.CFrame,
				},
				"execute",
				humanoidRootPart.CFrame,
			);
		}
	},

	effects: [],
};

export = wyvernAbility1;
