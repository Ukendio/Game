import { Store } from "@rbxts/rodux";
import { PlayerTeam, Actions, addTeammate, removeTeammate } from "server/core/store/actions";
import { State } from "server/core/store/reducer";
import listTeams from "server/core/gameModes/helpers/listTeams";
import unlistTeams from "server/core/gameModes/helpers/unlistTeams";
import settings from "./settings";
import { Vec } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";

async function buildTeam(store: Store<State, Actions>) {
	const availableTeams = store.getState().teams;
	const takenTeams = Vec.withCapacity<PlayerTeam>(availableTeams.len());

	const playerAdded = (player: Player) => {
		const team = availableTeams
			.pop()
			.map((team) => team)
			.unwrap();

		takenTeams.push(team);

		store.dispatch(addTeammate(player, team));
		player.Team = team.tag;
	};

	Players.PlayerRemoving.Connect((player) => {
		const drainedTeams = takenTeams.drainFilter([0, takenTeams.len() - 1], (team) => team.tag === player.Team);

		for (const team of drainedTeams) {
			availableTeams.push(team);
			store.dispatch(removeTeammate(player, team));
		}
	});

	for (const player of Players.GetPlayers()) {
		playerAdded(player);
	}
}

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
