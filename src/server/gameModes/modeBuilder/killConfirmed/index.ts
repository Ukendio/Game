import listTeams from "server/gameModes/helpers/listTeams";
import unlistTeams from "server/gameModes/helpers/unlistTeams";
import settings from "./settings";
import Log from "@rbxts/log";
import { PlayerTeam } from "shared/Types";
import store from "server/core/rodux/store";

function maxKills() {
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

async function winCondition() {
	return unlistTeams()
		.andThenCall(listTeams, settings.teams)
		.then(() =>
			Promise.race([
				maxKills().then((winners) => {
					Log.Info("The winners are {winners}", winners);
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
