import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Players } from "@rbxts/services";
import { ConfigurableSettings } from "server/core/factory/createGun";
import Mode from "shared/Mode";
import matchModeForKill from "./matchModeForKill";

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

		configurableSettings: ConfigurableSettings;
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

	configureSettings?: (this: ThisFabricUnit<"Gun">, configurableSettings: ConfigurableSettings) => void;
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
		hit: "Miss",
		player: undefined,
		ricochet: false,
		filter: [],
		origin: undefined,
		direction: undefined,

		configurableSettings: {
			fireRate: 1,
			recoil: 1,
			maxDistance: 400,
			mode: Mode.Semi,
			damage: 15,
		},
	},

	onClientShoot: function (this, _player, packet) {
		const settings = this.get("configurableSettings");
		if (this.get("debounce") === true) {
			this.addLayer("damage", {
				debounce: false,
				target: packet.target,
				hit: packet.hit,
				player: _player,
			});

			Promise.delay(settings.fireRate).then(() => this.removeLayer("damage"));
		}
	},

	configureSettings: function (this, settings) {
		this.addLayer("settings", {
			configurableSettings: settings,
		});
	},

	effects: [
		function (this) {
			const hit = this.get("hit");
			const target = this.get("target");
			const player = this.get("player");

			if (hit !== undefined && hit !== "Miss" && target !== undefined) {
				const enemyCharacter = target.Parent as Model;
				const enemyPlayer = Players.GetPlayerFromCharacter(enemyCharacter);
				const humanoid = enemyCharacter.FindFirstChildOfClass("Humanoid");

				if (player && enemyPlayer && humanoid) {
					humanoid.TakeDamage(tonumber(hit)!);

					if (humanoid.Health <= 0) matchModeForKill(player, enemyPlayer);
				}
			}
		},
	],
};

export = gun;
