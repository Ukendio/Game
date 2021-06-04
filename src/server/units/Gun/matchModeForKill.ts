import store from "server/core/store";
import { addKillToTeam, addDeathToTeam } from "server/core/store/actions";
import { match } from "shared/rbxts-pattern";
import updateKills from "./updateKills";

function matchModeForKill(player: Player, enemyPlayer: Player) {
	updateKills(player, enemyPlayer);

	match(store.getState().gameMode)
		.with("Team Deathmatch", () => {
			if (store.getState().sequence === "intermission") return;

			store.getState().teams.forEach((team) => {
				if (team.tag === player.Team) {
					store.dispatch(addKillToTeam(team));
				} else if (team.tag === enemyPlayer.Team) {
					store.dispatch(addDeathToTeam(team));
				}
			});
		})
		.with("Free For All", () => {
			if (store.getState().sequence === "intermission") return;

			return;
		});
}

export = matchModeForKill;
