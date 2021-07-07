import { Store } from "@rbxts/rodux";
import { PlayerTeam, Actions } from "shared/rodux/actions";
import { State } from "shared/rodux/reducer";
import listTeams from "shared/gameModes/helpers/listTeams";
import unlistTeams from "shared/gameModes/helpers/unlistTeams";
import settings from "./settings";
import Log from "@rbxts/log";

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
					Log.Info("The winners are {}", winners);
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

					Log.Info("The winners are {}", winningTeam);
				}),
			]),
		);
}

export = winCondition;
