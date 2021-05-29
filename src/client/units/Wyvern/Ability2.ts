import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Players, Workspace } from "@rbxts/services";

declare global {
	interface FabricUnits {
		WyvernAbility2: WyvernAbility2Definition;
	}
}

interface WyvernAbility2Definition extends UnitDefinition<"WyvernAbility2"> {
	name: "WyvernAbility2";

	ref?: Player;

	units: {
		Replicated: [];
	};

	defaults: {
		root: CFrame;
	};

	execute?: (this: ThisFabricUnit<"WyvernAbility2">) => void;

	onClientExecute?: (this: ThisFabricUnit<"Ability">, _player: Player, root: CFrame) => void;
}

const player = Players.LocalPlayer;

const CACHE_DISTANCE = new CFrame(new Vector3(math.huge, math.huge, math.huge));

const wyvernAbility1: WyvernAbility2Definition = {
	name: "WyvernAbility2",

	defaults: {
		root: CACHE_DISTANCE,
	},

	units: {
		Replicated: [],
	},

	execute: function (this) {
		const character = player.Character;
		const humanoidRootPart = character?.FindFirstChild("HumanoidRootPart") as BasePart;

		if (character && humanoidRootPart) {
			this.getOrCreateUnit("Transmitter").sendWithPredictiveLayer(
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
