import FabricLib, { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Workspace } from "@rbxts/services";
import { CharacterRigR15 } from "@rbxts/yield-for-character";

declare global {
	interface FabricUnits {
		Gun: GunDefinition;
	}
}

const FIRE_RATE = 1;

interface GunDefinition extends UnitDefinition<"Gun"> {
	name: "Gun";
	tag: "Gun";

	units: {
		Replicated: {};
	};

	defaults?: {
		debounce: boolean;
		mouseDown: boolean;
		equipped: boolean;
		origin: Vector3;
		direction: Vector3;
		hit: string;
		target: Model;
	};

	onClientShoot?: (
		this: ThisFabricUnit<"Gun">,
		_player: Player,
		data: {
			origin: Vector3;
			direction: Vector3;
		},
	) => void;
}

const gun: GunDefinition = {
	name: "Gun",
	tag: "Gun",

	units: {
		Replicated: {},
	},

	defaults: {
		debounce: true,
		mouseDown: false,
		equipped: false,
		origin: undefined!,
		direction: undefined!,
		hit: "Miss",
		target: undefined!,
	},

	onInitialize: function (this) {
		this.fabric.getOrCreateUnitByRef("Luck", this);
	},

	onClientShoot: function (this, _player, data) {
		if ((this.get("debounce") as boolean) === true) {
			this.removeLayer("rayLayer");
			this.addLayer("rayLayer", {
				origin: data.origin,
				direction: data.direction,
			});

			const luck = this.fabric.getOrCreateUnitByRef("Luck", this);
			this.addLayer("debounce", {
				debounce: false,
			});

			const tool = this.ref as Tool;

			const character = tool.Parent as CharacterRigR15;

			const rayCastParameters = new RaycastParams();
			rayCastParameters.FilterDescendantsInstances = [character];
			rayCastParameters.FilterType = Enum.RaycastFilterType.Blacklist;

			const direction = this.get("direction") as Vector3;

			if (direction !== undefined) {
				const result = Workspace.Raycast(this.get("origin") as Vector3, direction, rayCastParameters);
				const target = result?.Instance;

				if (result && target) {
					const hit = luck.applyLuck?.(math.random(10, 50));
					this.addLayer("damage", {
						hit: hit,
						target: result.Instance,
					});
				}
			}

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
				((this.get("target") as Instance).Parent?.FindFirstChild("Humanoid") as Humanoid).TakeDamage(
					tonumber(damage)!,
				);
			}
		},
	],
};

export = gun;
