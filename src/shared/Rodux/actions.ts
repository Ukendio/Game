import Rodux from "@rbxts/rodux";
import { Vec } from "@rbxts/rust-classes";
import { gameModes } from "shared/gameModes";
import { TopicFormat } from "shared/Types";
import { PlayerScore } from "./reducer";

interface AddKillAction extends Rodux.Action<"AddKillToPlayer"> {
	player: Player;
}

export function addKillToPlayer(player: Player): AddKillAction {
	return {
		type: "AddKillToPlayer",
		player: player,
	};
}

interface AddDeathAction extends Rodux.Action<"AddDeathToPlayer"> {
	player: Player;
}

export function addDeathToPlayer(player: Player): AddDeathAction {
	return {
		type: "AddDeathToPlayer",
		player: player,
	};
}

interface StartVoteAction extends Rodux.Action<"StartVote"> {}

export function startVote(): StartVoteAction {
	return {
		type: "StartVote",
	};
}

interface StopVoteAction extends Rodux.Action<"StopVote"> {}

export function stopVote(): StopVoteAction {
	return {
		type: "StopVote",
	};
}

interface CreateTopicAction extends Rodux.Action<"CreateTopic"> {
	topic: TopicFormat;
}

export function createTopic(topic: TopicFormat): CreateTopicAction {
	return {
		type: "CreateTopic",
		topic: topic,
	};
}

interface CastVoteAction extends Rodux.Action<"CastVote"> {
	player: Player;
	vote: string;
}

export function castVote(player: Player, vote: string): CastVoteAction {
	return {
		type: "CastVote",
		player: player,
		vote: vote,
	};
}

interface AddPlayerToBoardAction extends Rodux.Action<"AddPlayerToBoard"> {
	playerScore: PlayerScore;
}

export function addPlayerToBoard(playerScore: PlayerScore): AddPlayerToBoardAction {
	return {
		type: "AddPlayerToBoard",
		playerScore: playerScore,
	};
}

interface ChangeRankingAction extends Rodux.Action<"ChangeRanking"> {}

export function changeRanking(): ChangeRankingAction {
	return {
		type: "ChangeRanking",
	};
}

interface DeployAction extends Rodux.Action<"Deploy"> {
	player: Player;
}

export function deploy(player: Player): DeployAction {
	return {
		type: "Deploy",
		player: player,
	};
}

interface DepartAction extends Rodux.Action<"Depart"> {
	player: Player;
}

export function depart(player: Player): DepartAction {
	return {
		type: "Depart",
		player: player,
	};
}

interface StartAction extends Rodux.Action<"Start"> {}

export function startRound(): StartAction {
	return {
		type: "Start",
	};
}

interface StopAction extends Rodux.Action<"Stop"> {}

export function stopRound(): StopAction {
	return {
		type: "Stop",
	};
}

interface SelectGameModeAction extends Rodux.Action<"SelectGameMode"> {
	gameMode: keyof typeof gameModes;
}

export function selectGameMode(gameMode: keyof typeof gameModes): SelectGameModeAction {
	return {
		type: "SelectGameMode",
		gameMode: gameMode,
	};
}

interface SelectMapAction extends Rodux.Action<"SelectMap"> {
	map: string;
}

export function selectMap(map: string): SelectMapAction {
	return {
		type: "SelectMap",
		map: map,
	};
}

interface AddPlayerToTableAction extends Rodux.Action<"AddPlayerToTable"> {
	player: Player;
}

export function addPlayerToTable(player: Player): AddPlayerToTableAction {
	return {
		type: "AddPlayerToTable",
		player: player,
	};
}

interface SetSpawnLocationsAction extends Rodux.Action<"SetSpawnLocations"> {
	positions: Set<SpawnLocation>;
}

export function setSpawnLocations(positions: Set<SpawnLocation>): SetSpawnLocationsAction {
	return {
		type: "SetSpawnLocations",
		positions: positions,
	};
}

export interface PlayerTeam {
	tag: Team;
	kills: number;
	deaths: number;
	members: Vec<Player>;
}
interface AddTeammateAction extends Rodux.Action<"AddTeammate"> {
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

interface RemoveTeammateAction extends Rodux.Action<"RemoveTeammateAction"> {
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

interface AddKillToTeamAction extends Rodux.Action<"AddKillToTeam"> {
	team: PlayerTeam;
}

export function addKillToTeam(team: PlayerTeam): AddKillToTeamAction {
	return {
		type: "AddKillToTeam",
		team: team,
	};
}

interface AddDeathToTeamAction extends Rodux.Action<"AddDeathToTeam"> {
	team: PlayerTeam;
}

export function addDeathToTeam(team: PlayerTeam): AddDeathToTeamAction {
	return {
		type: "AddDeathToTeam",
		team: team,
	};
}

interface EnlistAction extends Rodux.Action<"EnlistTeam"> {
	team: PlayerTeam;
}

export function enlistTeam(team: PlayerTeam): EnlistAction {
	return {
		type: "EnlistTeam",
		team: team,
	};
}

export type Actions =
	| AddKillAction
	| AddDeathAction
	| StartVoteAction
	| StopVoteAction
	| CastVoteAction
	| CreateTopicAction
	| AddPlayerToBoardAction
	| ChangeRankingAction
	| DeployAction
	| DepartAction
	| StartAction
	| StopAction
	| SelectGameModeAction
	| SelectMapAction
	| SetSpawnLocationsAction
	| AddTeammateAction
	| AddKillToTeamAction
	| RemoveTeammateAction
	| AddDeathToTeamAction
	| EnlistAction;
