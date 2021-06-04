import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Players } from "@rbxts/services";
import matchModeForKill from "./matchModeForKill";

const FIRE_RATE = 1;

declare global {
	interface FabricUnits {
		Gun: GunDefinition;
	}
}

interface GunDefinition extends UnitDefinition<"Gun"> {
	name: "Gun";

	units: {
		Replicated: [];
	};

	defaults: {
		debounce: boolean;
		mouseDown: boolean;
		equipped: boolean;
		target: BasePart | undefined;
		hit: string | undefined;
		player: Player | undefined;
		ricochet: boolean;
		filter: Instance[];
		origin: undefined | Vector3;
		direction: undefined | Vector3;
	};

	ref?: Tool;

	onClientShoot?: (
		this: ThisFabricUnit<"Gun">,
		_player: Player,
		data: {
			target: BasePart;
			hit: string;
		},
	) => void;
}

const gun: GunDefinition = {
	name: "Gun",

	units: {
		Replicated: [],
	},

	defaults: {
		debounce: true,
		mouseDown: false,
		equipped: false,
		target: undefined,
		hit: undefined,
		player: undefined,
		ricochet: false,
		filter: [],
		origin: undefined,
		direction: undefined,
	},

	onClientShoot: function (this, _player, packet) {
		if (this.get("debounce") === true) {
			this.addLayer("damage", {
				debounce: false,
				target: packet.target,
				hit: packet.hit,
				player: _player,
			});

			print(packet);
			Promise.delay(FIRE_RATE).then(() => this.removeLayer("damage"));
		}
	},

	effects: [
		function (this) {
			const damage = this.get("hit");
			const target = this.get("target");
			const player = this.get("player");

			if (damage !== undefined && damage !== "Miss" && target !== undefined) {
				const enemyCharacter = target.Parent as Model;
				const enemyPlayer = Players.GetPlayerFromCharacter(enemyCharacter);
				const humanoid = enemyCharacter.FindFirstChildOfClass("Humanoid");

				if (player && enemyPlayer && humanoid) {
					humanoid.TakeDamage(tonumber(damage)!);

					if (humanoid.Health <= 0) matchModeForKill(player, enemyPlayer);
				}
			}
		},
	],
};

export = gun;
