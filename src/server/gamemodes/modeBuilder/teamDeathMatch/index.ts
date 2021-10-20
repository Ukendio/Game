import listTeams from "server/gamemodes/helpers/listTeams";
import unlistTeams from "server/gamemodes/helpers/unlistTeams";
import settings from "./settings";
import Log from "@rbxts/log";
import { State, Actions } from "server/core/rodux/store";
import { PlayerTeam } from "shared/Types";
import { Store } from "@rbxts/rodux";

function maxKills(store: Store<State, Actions>): Promise<Team> {
	return new Promise((resolve) => {
		store.changed.connect(() => {
			store
				.getState()
				.team.teams.iter()
				.forEach((team) => {
					if (team.kills >= settings.maxKills) resolve(team.tag);
				});
		});
	});
}

async function winCondition(store: Store<State, Actions>): Promise<void> {
	return unlistTeams()
		.andThenCall(listTeams, settings.teams, store)
		.then(() =>
			Promise.race([
				maxKills(store).then((winners) => {
					Log.Info("The winners are {}", winners);
				}),
				Promise.delay(settings.roundLength).then(() => {
					let winningTeam = undefined! as PlayerTeam;
					let mostKills = 0;
					store
						.getState()
						.team.teams.iter()
						.forEach((team) => {
							if (team.kills > mostKills) {
								winningTeam = team;
								mostKills = team.kills;
							}
						});

					Log.Info("The winners are {}", winningTeam);
				}),
			]),
		);
}

export = winCondition;
