import { Store } from "@rbxts/rodux";
import { PlayerTeam, Actions } from "server/core/store/actions";
import { State } from "server/core/store/reducer";
import listTeams from "../../listTeams";
import unlistTeams from "../../unlistTeams";
import settings from "./settings";

function maxKills(store: Store<State, Actions>) {
	return new Promise((resolve) => {
		store.changed.connect(() => {
			store.getState().teams.forEach((team) => {
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
					store.getState().teams.forEach((team) => {
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
