import Rodux from "@rbxts/rodux";

export interface PlayerTeam {
	tag: Team;
	kills: number;
	deaths: number;
	members: Player[];
}
export interface AddTeammateAction extends Rodux.Action<"AddTeammate"> {
	player: Player;
	team: PlayerTeam;
}

export function addTeammate(player: Player, team: PlayerTeam): AddTeammateAction {
	return {
		type: "AddTeammate",
		player: player,
		team: team,
	};
}

export interface RemoveTeammateAction extends Rodux.Action<"RemoveTeammateAction"> {
	player: Player;
	team: PlayerTeam;
}

export function removeTeammate(player: Player, team: PlayerTeam): RemoveTeammateAction {
	return {
		type: "RemoveTeammateAction",
		player: player,
		team: team,
	};
}

export interface AddKillToTeamAction extends Rodux.Action<"AddKillToTeam"> {
	team: PlayerTeam;
}

export function addKillToTeam(team: PlayerTeam): AddKillToTeamAction {
	return {
		type: "AddKillToTeam",
		team: team,
	};
}

export interface AddDeathToTeamAction extends Rodux.Action<"AddDeathToTeam"> {
	team: PlayerTeam;
}

export function addDeathToTeam(team: PlayerTeam): AddDeathToTeamAction {
	return {
		type: "AddDeathToTeam",
		team: team,
	};
}

export interface EnlistAction extends Rodux.Action<"EnlistTeam"> {
	team: PlayerTeam;
}

export function enlistTeam(team: PlayerTeam): EnlistAction {
	return {
		type: "EnlistTeam",
		team: team,
	};
}
