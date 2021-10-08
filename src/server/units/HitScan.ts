import { Signal } from "@rbxts/flipper/typings/Signal";
import { Players } from "@rbxts/services";
import KillTag from "server/core/KillTag";

export = identity<FabricUnits["HitScan"]>({
	name: "HitScan",

	units: {
		Replicated: {},
	},

	defaults: {},

	onClientHit: function (this, player, { target }) {
		if (player) {
			this.addLayer("damage", {
				target,
				player,
			});
		}
	},

	effects: [
		function (this) {
			const targeted_base_part = this.get("target");
			const player = this.get("player");
			const enemy_player_character = targeted_base_part?.Parent as Model;

			if (player && Players.GetPlayerFromCharacter(enemy_player_character)) {
				const humanoid = enemy_player_character.FindFirstChild("Humanoid") as Humanoid;
				const damage = this.ref.get("damage");
				const time_stamp = os.clock();

				humanoid.TakeDamage(damage);

				KillTag.create_kill_tag(
					{
						player,
						time_stamp,
						damage,
					},
					enemy_player_character,
				);
			}
		},
	],
});
