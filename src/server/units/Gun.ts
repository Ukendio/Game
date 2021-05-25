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
		damage: number;
		debounce: boolean;
		mouseDown: boolean;
		equipped: boolean;
		origin: Vector3;
		direction: Vector3;
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
		damage: 0,
		debounce: true,
		mouseDown: false,
		equipped: false,
		origin: undefined!,
		direction: undefined!,
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
				damage: luck.applyLuck!(math.random(10, 50)),
				debounce: false,
			});

			Promise.delay(FIRE_RATE).then(() => {
				this.removeLayer("debounce");
			});
		}
	},

	effects: [
		function (this) {
			const tool = this.ref as Tool;

			const character = tool.Parent as CharacterRigR15;

			const rayCastParameters = new RaycastParams();
			rayCastParameters.FilterDescendantsInstances = [character];
			rayCastParameters.FilterType = Enum.RaycastFilterType.Blacklist;

			const direction = this.get("direction") as Vector3;

			if (direction !== undefined) {
				const result = Workspace.Raycast(this.get("origin") as Vector3, direction, rayCastParameters);
				const hit = result?.Instance;

				if (result && hit) {
					const humanoid = hit.Parent?.FindFirstChildOfClass("Humanoid");

					if (humanoid) humanoid.TakeDamage(this.get("damage") as number);
				}
			}
		},
	],
};

export = gun;
