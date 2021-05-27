import { Teams, Players } from "@rbxts/services";
import { teamStore, enlistTeam, PlayerTeam, addTeammate, removeTeammate } from "server/core/Team";
import SETTINGS from "./settings";

//PLAYER HANDLING; ugly spaghetti code
{
	SETTINGS.TEAMS.forEach((colour) => {
		const team = new Instance("Team");
		team.TeamColor = colour;
		team.Parent = Teams;

		teamStore.dispatch(
			enlistTeam({
				tag: team,
				kills: 0,
				deaths: 0,
				members: [],
			}),
		);
	});

	const availableTeams = [...teamStore.getState().teams];
	const takenTeams = new Array<PlayerTeam>();

	const playerAdded = (player: Player) => {
		const team = availableTeams.pop()!;
		takenTeams.push(team);

		teamStore.dispatch(addTeammate(player, team));
	};

	Players.PlayerAdded.Connect(playerAdded);
	Players.PlayerRemoving.Connect((player) => {
		teamStore.getState().teams.forEach((current) => {
			if (current && current.tag === player.Team) {
				const team = takenTeams.pop()!;

				availableTeams.push(team);
				teamStore.dispatch(removeTeammate(player, team));
			}
		});
	});

	for (const player of Players.GetPlayers()) {
		playerAdded(player);
	}
}

function maxKills() {
	return new Promise((resolve) => {
		teamStore.changed.connect(() => {
			teamStore.getState().teams.forEach((team) => {
				if (team.kills >= SETTINGS.MAX_KILLS) resolve(team.tag);
			});
		});
	});
}
function winCondition() {
	return Promise.race([
		maxKills().then((winners) => {
			print(winners);
		}),
		Promise.delay(SETTINGS.ROUND_LENGTH).then(() => {
			print("tie");
		}),
	]);
}

export = winCondition;
