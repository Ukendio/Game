import FabricLib, { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Workspace } from "@rbxts/services";
import { CharacterRigR15 } from "@rbxts/yield-for-character";

const FIRE_RATE = 1;

const gun: FabricUnits["Gun"] = {
	name: "Gun",
	tag: "Gun",

	units: {
		Replicated: {},
	},

	defaults: {
		debounce: true,
		mouseDown: false,
		equipped: false,
		target: undefined!,
	},

	onInitialize: function (this) {
		this.fabric.getOrCreateUnitByRef("Luck", this);
	},

	onClientShoot: function (this, _player, target) {
		if ((this.get("debounce") as boolean) === true) {
			const luck = this.fabric.getOrCreateUnitByRef("Luck", this);
			this.addLayer("debounce", {
				debounce: false,
			});

			this.addLayer("damage", {
				hit: luck.applyLuck?.(math.random(10, 50)),
				target: target,
			});

			Promise.delay(FIRE_RATE).then(() => {
				this.removeLayer("damage");
				this.removeLayer("debounce");
			});
		}
	},

	effects: [
		function (this) {
			const damage = this.get("hit");
			if (damage !== undefined && typeIs(damage, "string") && damage !== "Miss") {
				const target = this.get("target") as BasePart;
				if (target) {
					print(target);
					const humanoid = target.Parent?.FindFirstChildOfClass("Humanoid");
					if (humanoid) {
						humanoid.TakeDamage(tonumber(this.get("hit") as string)!);

						print(`Shot at ${(this.get("target") as Instance).Parent?.Name}`);
					}
				}
			}
		},
	],
};

export = gun;
