import { Store } from "@rbxts/rodux";
import { Players, Teams } from "@rbxts/services";
import { enlistTeam, PlayerTeam, addTeammate, removeTeammate, Actions } from "server/core/store/actions";
import { State } from "server/core/store/reducer";
import SETTINGS from "./settings";

function maxKills(store: Store<State, Actions>) {
	return new Promise((resolve) => {
		store.changed.connect(() => {
			store.getState().teams.forEach((team) => {
				if (team.kills >= SETTINGS.MAX_KILLS) resolve(team.tag);
			});
		});
	});
}

function winCondition(store: Store<State, Actions>) {
	SETTINGS.TEAMS.forEach((colour) => {
		const team = new Instance("Team");
		team.TeamColor = colour;
		team.Parent = Teams;

		store.dispatch(
			enlistTeam({
				tag: team,
				kills: 0,
				deaths: 0,
				members: [],
			}),
		);
	});

	const availableTeams = [...store.getState().teams];
	const takenTeams = new Array<PlayerTeam>();

	const playerAdded = (player: Player) => {
		const team = availableTeams.pop()!;
		takenTeams.push(team);

		store.dispatch(addTeammate(player, team));
		player.Team = team.tag;
	};

	Players.PlayerRemoving.Connect((player) => {
		store.getState().teams.forEach((current) => {
			if (current && current.tag === player.Team) {
				const team = takenTeams.pop()!;

				availableTeams.push(team);
				store.dispatch(removeTeammate(player, team));
			}
		});
	});

	for (const player of Players.GetPlayers()) {
		playerAdded(player);
	}

	return Promise.race([
		maxKills(store).then((winners) => {
			print(winners);
		}),
		Promise.delay(SETTINGS.ROUND_LENGTH).then(() => {
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
	]);
}

export = winCondition;
