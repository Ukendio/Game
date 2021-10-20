import { Workspace } from "@rbxts/services";

const newShield = new Instance("Part");
newShield.Anchored = true;
newShield.CanCollide = false;
newShield.Transparency = 0.5;
newShield.Size = new Vector3(30, 15, 30);
newShield.Parent = Workspace;

const wyvernAbility1: FabricUnits["WyvernAbility2"] = {
	name: "WyvernAbility2",

	units: {
		Replicated: {},
	},

	onClientExecute: function (this, _player, root) {
		const character = _player.Character;
		const humanoidRootPart = character?.FindFirstChild("HumanoidRootPart");

		if (humanoidRootPart) {
			this.addLayer("shield", {
				root: root,
				name: tostring(_player.UserId),
			});

			Promise.delay(5)
				.then(() => this.removeLayer("shield"))
				.catch((reason) => warn(reason));
		}
	},

	effects: [
		function (): void {
			const root = this.get("root");
			const name = this.get("name");
			if (root && name) {
				newShield.CFrame = root;
				newShield.Name = `${name}_shield`;
			}
		},
	],
};

export = wyvernAbility1;
