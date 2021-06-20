import { Fabric } from "@rbxts/fabric";
import store from "server/core/store";
import { addKillToPlayer, addDeathToPlayer, addKillToTeam, addDeathToTeam } from "server/core/store/actions";
import { createTag } from "server/core/unitFactory/createTag";
import { match } from "shared/rbxts-pattern";

function matchModeForKill(fabric: Fabric, player: Player, enemyPlayer: Player) {
	return match(store.getState().gameMode)
		.with("Team Deathmatch", () => {
			if (store.getState().sequence === "intermission") return;

			store.dispatch(addKillToPlayer(player));
			store.dispatch(addDeathToPlayer(enemyPlayer));

			store
				.getState()
				.teams.iter()
				.forEach((team) => {
					if (team.tag === player.Team) {
						store.dispatch(addKillToTeam(team));
					} else if (team.tag === enemyPlayer.Team) {
						store.dispatch(addDeathToTeam(team));
					}
				});
		})
		.with("Free For All", () => {
			if (store.getState().sequence === "intermission") return;
			store.dispatch(addKillToPlayer(player));
			store.dispatch(addDeathToPlayer(enemyPlayer));
		})
		.with("Kill Confirmed", () => {
			createTag(fabric, enemyPlayer);
		})
		.run();
}

export = matchModeForKill;
