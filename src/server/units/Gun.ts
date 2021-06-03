import { Players } from "@rbxts/services";
import store from "server/core/store";
import { addKillToPlayer, addDeathToPlayer, addKillToTeam, addDeathToTeam } from "server/core/store/actions";
import { match } from "shared/rbxts-pattern";

const FIRE_RATE = 1;

const gun: FabricUnits["Gun"] = {
	name: "Gun",

	units: {
		Replicated: [],
	},

	defaults: {
		debounce: true,
		mouseDown: false,
		equipped: false,
		target: undefined!,
		hit: undefined!,
		player: undefined!,
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
				const humanoid = (target.Parent as Model).FindFirstChildOfClass("Humanoid");

				if (humanoid) {
					humanoid.TakeDamage(tonumber(this.get("hit") as string)!);

					if (humanoid.Health <= 0)
						match(store.getState().gameMode)
							.with("Team Deathmatch", () => {
								if (store.getState().sequence === "intermission") return;

								store.dispatch(addKillToPlayer(player));
								store.dispatch(addDeathToPlayer(player));

								store.getState().teams.forEach((team) => {
									if (team.tag === player.Team) {
										store.dispatch(addKillToTeam(team));
									} else if (team.tag === Players.GetPlayerFromCharacter(target.Parent)!.Team) {
										store.dispatch(addDeathToTeam(team));
									}
								});
							})
							.with("Free For All", () => {
								if (store.getState().sequence === "intermission") return;

								store.dispatch(addKillToPlayer(player));
								store.dispatch(addDeathToPlayer(player));
							});
				}
			}
		},
	],
};

export = gun;
