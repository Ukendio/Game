import { Dependency } from "@flamework/core";
import { Store } from "@rbxts/rodux";
import { State, Actions } from "server/core/rodux/store";
import type { UnitConstructor } from "server/services/unitConstructor";
import { match } from "@rbxts/rbxts-pattern";
import { Sequence } from "shared/Types";

const unitConstructor = Dependency<UnitConstructor>();

function matchModeForKill(player: Player, enemyPlayer: Player, store: Store<State, Actions>) {
	if (store.getState().round.sequence === Sequence.Intermission) return;

	return match(store.getState().election)
		.with({ gameMode: "Team Deathmatch" }, () => {
			store.dispatch({ type: "AddKillToPlayer", player: player });
			store.dispatch({ type: "AddDeathToPlayer", player: enemyPlayer });
			store
				.getState()
				.team.teams.iter()
				.forEach((team) =>
					match({ TeamColor: team.tag.TeamColor })
						.with({ TeamColor: player.TeamColor }, () => {
							store.dispatch({ type: "AddKillToTeam", team: team });
						})
						.with({ TeamColor: enemyPlayer.TeamColor }, () => {
							store.dispatch({ type: "AddDeathToTeam", team: team });
						})
						.run(),
				);
		})
		.with({ gameMode: "Free For All" }, () => {
			store.dispatch({ type: "AddKillToPlayer", player: player });
			store.dispatch({ type: "AddDeathToPlayer", player: enemyPlayer });
		})
		.with({ gameMode: "Kill Confirmed" }, () => {
			unitConstructor.createTag(enemyPlayer);
		})
		.otherwise(() => {
			error("Invalid gamemode");
		});
}

export = matchModeForKill;
