import { Store } from "@rbxts/rodux";
import { PlayerTeam, Actions } from "server/core/store/actions";
import { State } from "server/core/store/reducer";
import listTeams from "server/core/gameModes/helpers/listTeams";
import unlistTeams from "server/core/gameModes/helpers/unlistTeams";
import settings from "./settings";

function maxKills(store: Store<State, Actions>) {
	return new Promise((resolve) => {
		store.changed.connect(() => {
			store
				.getState()
				.teams.iter()
				.forEach((team) => {
					if (team.kills >= settings.maxKills) resolve(team.tag);
				});
		});
	});
}

async function winCondition(store: Store<State, Actions>) {
	return unlistTeams()
		.andThenCall(listTeams, settings.teams, store)
		.then(() =>
			Promise.race([
				maxKills(store).then((winners) => {
					print(winners);
				}),
				Promise.delay(settings.roundLength).then(() => {
					let winningTeam = undefined! as PlayerTeam;
					let mostKills = 0;
					store
						.getState()
						.teams.iter()
						.forEach((team) => {
							if (team.kills > mostKills) {
								winningTeam = team;
								mostKills = team.kills;
							}
						});

					print(winningTeam);
				}),
			]),
		);
}

export = winCondition;
