import listTeams from "server/gamemodes/helpers/listTeams";
import unlistTeams from "server/gamemodes/helpers/unlistTeams";
import settings from "./settings";
import { Vec } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import Log from "@rbxts/log";
import { Actions, State } from "server/core/rodux/store";
import { PlayerTeam } from "shared/Types";
import { Store } from "@rbxts/rodux";

function buildTeam(store: Store<State, Actions>): void {
	const availableTeams = store.getState().team.teams;

	const takenTeams = Vec.withCapacity<PlayerTeam>(availableTeams.len());

	const playerAdded = (player: Player): void => {
		const team = availableTeams
			.pop()
			.map((team) => team)
			.unwrap();

		takenTeams.push(team);

		store.dispatch({ type: "AddTeammate", player: player, team: team });
		player.Team = team.tag;
	};

	Players.PlayerRemoving.Connect((player) => {
		const drainedTeams = takenTeams
			.drainFilter([0, takenTeams.len() - 1], (team) => team.tag === player.Team)
			.generator();

		for (const team of drainedTeams) {
			availableTeams.push(team);
			store.dispatch({ type: "RemoveTeammate", player: player, team: team });
		}
	});

	for (const player of Players.GetPlayers()) {
		playerAdded(player);
	}
}

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
	buildTeam(store);

	return unlistTeams()
		.andThenCall(listTeams, settings.teams, store)
		.then(() =>
			Promise.race([
				maxKills(store).then((winners) => {
					Log.Info("{winners}", winners);
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

					Log.Info("{winner} won", winningTeam);
				}),
			]),
		);
}

export = winCondition;
