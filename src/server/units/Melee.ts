import { Players } from "@rbxts/services";
import matchModeForKill from "server/core/gameModes/helpers/matchModeForKill";

const melee: FabricUnits["Melee"] = {
	name: "Melee",

	units: {
		Replicated: [],
	},

	defaults: {
		debounce: true,
		target: undefined,
		hit: "Miss",
		origin: undefined,
		direction: undefined,
		player: undefined,
	},

	onClientSlash: function (this, _player, packet) {
		if (this.get("debounce")) {
			this.addLayer("damage", {
				debounce: false,
				hit: packet.hit,
				target: packet.target,
				player: _player,
			});

			Promise.delay(1).then(() => this.removeLayer("damage"));
		}
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

export = melee;
