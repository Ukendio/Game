import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Players, Workspace } from "@rbxts/services";

declare global {
	interface FabricUnits {
		WyvernAbility2: WyvernAbility2Definition;
	}
}

interface WyvernAbility2Definition extends UnitDefinition<"WyvernAbility2"> {
	name: "WyvernAbility2";

	defaults: {
		root: CFrame;
	};

	execute: (this: ThisFabricUnit<"WyvernAbility2">) => void;
}

const player = Players.LocalPlayer;

const CACHE_DISTANCE = new CFrame(new Vector3(math.huge, math.huge, math.huge));

const newShield = new Instance("Part");
newShield.Anchored = true;
newShield.CanCollide = false;
newShield.Transparency = 0.5;
newShield.Size = new Vector3(30, 15, 30);
newShield.Name = player.UserId + "Shield";
newShield.CFrame = CACHE_DISTANCE;
newShield.Parent = Workspace;

const wyvernAbility1: WyvernAbility2Definition = {
	name: "WyvernAbility2",

	defaults: {
		root: CACHE_DISTANCE,
	},

	onInitialize: function (this) {
		print("initialized");
	},
	execute: function (this) {
		const character = player.Character;
		const humanoidRootPart = character?.FindFirstChild("HumanoidRootPart") as BasePart;

		if (character && humanoidRootPart) {
			this.addLayer("shield", {
				root: humanoidRootPart.CFrame,
			});

			Promise.delay(8).then(() => this.removeLayer("shield"));
		}
	},

	effects: [
		function (this) {
			const root = this.get("root");
			newShield.CFrame = root;
		},
	],
};

export = wyvernAbility1;
