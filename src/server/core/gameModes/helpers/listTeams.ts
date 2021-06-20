import { Store } from "@rbxts/rodux";
import { Players, Teams } from "@rbxts/services";
import { Actions, addTeammate, enlistTeam, PlayerTeam, removeTeammate } from "server/core/store/actions";
import { State } from "server/core/store/reducer";

export = async function (colours: BrickColor[], store: Store<State, Actions>) {
	colours.forEach((colour) => {
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

	const availableTeams = [...store.getState().teams.asPtr()];
	const takenTeams = new Array<PlayerTeam>();

	const playerAdded = (player: Player) => {
		const team = availableTeams.pop()!;
		takenTeams.push(team);

		store.dispatch(addTeammate(player, team));
		player.Team = team.tag;
	};

	Players.PlayerRemoving.Connect((player) => {
		store
			.getState()
			.teams.iter()
			.forEach((current) => {
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
};
