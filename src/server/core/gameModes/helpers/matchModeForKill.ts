import { Fabric } from "@rbxts/fabric";
import store from "server/core/store";
import { addKillToPlayer, addDeathToPlayer, addKillToTeam, addDeathToTeam } from "server/core/store/actions";
import { createTag } from "server/core/unitFactory/createTag";
import { match } from "shared/rbxts-pattern";

function matchModeForKill(fabric: Fabric, player: Player, enemyPlayer: Player) {
	if (store.getState().sequence === "intermission") return;

	return match(store.getState().gameMode)
		.with("Team Deathmatch", () => {
			store.dispatch(addKillToPlayer(player));
			store.dispatch(addDeathToPlayer(enemyPlayer));

			store
				.getState()
				.teams.iter()
				.forEach((team) => {
					match(team.tag)
						.with({ TeamColor: player.TeamColor }, () => {
							store.dispatch(addKillToTeam(team));
						})
						.with({ TeamColor: enemyPlayer.TeamColor }, () => {
							store.dispatch(addDeathToTeam(team));
						})
						.run();
				});
		})
		.with("Free For All", () => {
			store.dispatch(addKillToPlayer(player));
			store.dispatch(addDeathToPlayer(enemyPlayer));
		})
		.with("Kill Confirmed", () => {
			createTag(fabric, enemyPlayer);
		})
		.otherwise(() => {
			error("Invalid gamemode");
		});
}

export = matchModeForKill;
