import { Fabric } from "@rbxts/fabric";
import { createTag } from "server/core/factory/createTag";
import store from "server/core/store";
import { addKillToTeam, addDeathToTeam, addKillToPlayer, addDeathToPlayer } from "server/core/store/actions";
import { match } from "shared/rbxts-pattern";

function matchModeForKill(fabric: Fabric, player: Player, enemyPlayer: Player) {
	match(store.getState().gameMode)
		.with("Team Deathmatch", () => {
			if (store.getState().sequence === "intermission") return;

			store.dispatch(addKillToPlayer(player));
			store.dispatch(addDeathToPlayer(enemyPlayer));

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
			store.dispatch(addKillToPlayer(player));
			store.dispatch(addDeathToPlayer(enemyPlayer));
		})
		.with("Kill Confirmed", () => {
			createTag(fabric, enemyPlayer);
		})
		.run();
}

export = matchModeForKill;
