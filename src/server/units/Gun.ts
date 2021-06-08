import { Players } from "@rbxts/services";
import matchModeForKill from "server/core/listeners/scoreHandler";
import { Mode } from "shared/Types";

const gun: FabricUnits["Gun"] = {
	name: "Gun",

	units: {
		Replicated: {},
		Luck: {},
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

					if (humanoid.Health <= 0) matchModeForKill(this.fabric, player, enemyPlayer);
				}
			}
		},
	],
};

export = gun;
