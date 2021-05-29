import { Players, Workspace } from "@rbxts/services";

const CACHE_DISTANCE = new CFrame(new Vector3(math.huge, math.huge, math.huge));

const newShield = new Instance("Part");
newShield.Anchored = true;
newShield.CanCollide = false;
newShield.Transparency = 0.5;
newShield.Size = new Vector3(30, 15, 30);
newShield.CFrame = CACHE_DISTANCE;
newShield.Parent = Workspace;

const wyvernAbility1: FabricUnits["WyvernAbility2"] = {
	name: "WyvernAbility2",

	defaults: {
		root: CACHE_DISTANCE,
	},

	units: {
		Replicated: [],
	},

	onInitialize: function (this) {
		print(this.name);
		newShield.Name = this.ref!.UserId + "Shield";
	},

	onClientExecute: function (this, _player, root) {
		const character = _player.Character;
		const humanoidRootPart = character?.FindFirstChild("HumanoidRootPart") as BasePart;

		if (humanoidRootPart) {
			this.addLayer("shield", {
				root: root,
			});

			Promise.delay(5).then(() => this.removeLayer("shield"));
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
