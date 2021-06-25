import { Dependency } from "@rbxts/flamework";
import store from "server/core/store";
import { addKillToPlayer, addDeathToPlayer, addKillToTeam, addDeathToTeam } from "shared/Rodux/actions";
import { UnitConstructor } from "server/services/unitConstructor";
import { match } from "shared/rbxts-pattern";

const unitConstructor = Dependency<UnitConstructor>();

function matchModeForKill(player: Player, enemyPlayer: Player) {
	if (store.getState().sequence === "intermission") return;

	return match(store.getState())
		.with({ gameMode: "Team Deathmatch" }, () => {
			store.dispatch(addKillToPlayer(player));
			store.dispatch(addDeathToPlayer(enemyPlayer));

			store
				.getState()
				.teams.iter()

				.forEach((team) => {
					match({ TeamColor: team.tag.TeamColor })
						.with({ TeamColor: player.TeamColor }, () => {
							store.dispatch(addKillToTeam(team));
						})
						.with({ TeamColor: enemyPlayer.TeamColor }, () => {
							store.dispatch(addDeathToTeam(team));
						})
						.run();
				});
		})
		.with({ gameMode: "Free For All" }, () => {
			store.dispatch(addKillToPlayer(player));
			store.dispatch(addDeathToPlayer(enemyPlayer));
		})
		.with({ gameMode: "Kill Confirmed" }, () => {
			unitConstructor.createTag(enemyPlayer);
		})
		.otherwise(() => {
			error("Invalid gamemode");
		});
}

export = matchModeForKill;