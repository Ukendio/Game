import Rodux, { Store } from "@rbxts/rodux";
import { Vec } from "@rbxts/rust-classes";
import { gameModes } from "shared/gameModes";
import { TopicFormat } from "shared/Types";
import { Actions, PlayerTeam } from "./actions";

export interface PlayerScore {
	player: Player;
	kills: number;
	deaths: number;
}

export interface State {
	teams: Vec<PlayerTeam>;
	ranking: Vec<PlayerScore>;
	voting: boolean;
	topic: TopicFormat;
	votes: Record<string, number>;
	hasVoted: Vec<Player>;
	sequence: "started" | "intermission";
	deployedPlayers: Vec<Player>;
	currentMap: string;
	gameMode: keyof typeof gameModes;
	winCondition: (store: Store<State, Actions>) => Promise<void>;
	spawnLocations: Set<SpawnLocation>;
}

const initialState: State = {
	teams: Vec.vec(),
	ranking: Vec.vec(),
	voting: false,
	topic: undefined!,
	votes: {},
	hasVoted: Vec.vec(),
	sequence: "intermission",
	deployedPlayers: Vec.vec(),
	currentMap: undefined!,
	gameMode: undefined!,
	winCondition: undefined!,
	spawnLocations: new Set<SpawnLocation>(),
};

export const reducer = Rodux.createReducer<State, Actions>(initialState, {
	AddKillToPlayer: (state, action) => {
		state.ranking
			.iter()
			.find((current) => current.player === action.player)
			.map((player) => player.kills++);

		return { ...state };
	},

	AddDeathToPlayer: (state, action) => {
		state.ranking
			.iter()
			.find((current) => current.player === action.player)
			.map((player) => player.deaths++);

		return { ...state };
	},

	StartVote: (state) => {
		const newState = { ...state, voting: true };
		state.topic.options.iter().forEach((index) => {
			newState.votes[index] = 0;
		});
		return newState;
	},

	StopVote: (state) => {
		return { ...state, voting: false, topic: undefined!, votes: {}, hasVoted: Vec.vec() };
	},

	CastVote: (state, action) => {
		const newState = { ...state, hasVoted: state.hasVoted.push(action.player) };
		newState.votes[action.vote]++;
		return newState;
	},

	CreateTopic: (state, action) => {
		return { ...state, topic: action.topic };
	},

	AddPlayerToBoard: (state, action) => {
		return { ...state, ranking: state.ranking.push(action.playerScore) };
	},

	ChangeRanking: (state) => {
		table.sort(state.ranking.asPtr(), (a, b) => a.kills < b.kills);

		return { ...state };
	},

	Deploy: (state, action) => {
		if (action.player.Parent !== undefined) {
			return { ...state, deployedPlayers: state.deployedPlayers.push(action.player) };
		}
		return state;
	},

	Depart: (state, action) => {
		return {
			...state,
			deployedPlayers: state.deployedPlayers
				.iter()
				.filter((player) => player !== action.player)
				.collect(),
		};
	},

	Start: (state) => {
		if (state.sequence === "intermission") {
			return { ...state, sequence: "intermission" };
		}

		return state;
	},

	Stop: (state) => {
		if (state.sequence === "started") {
			return { ...state, sequence: "intermission" };
		}
		return state;
	},

	SelectGameMode: (state, action) => {
		return { ...state, gameMode: action.gameMode, winCondition: gameModes[action.gameMode] };
	},

	SelectMap: (state, action) => {
		const newState = { ...state };
		newState.currentMap = action.map;

		return newState;
	},

	SetSpawnLocations: (state, action) => {
		if (action.positions !== undefined) {
			const newState = { ...state };
			newState.spawnLocations = action.positions;
			return newState;
		}
		return state;
	},

	AddKillToTeam: (state, action) => {
		const newState = { ...state };
		newState.teams
			.iter()
			.find((team) => team === action.team)
			.map((playerTeam) => playerTeam.kills++);

		return newState;
	},

	AddDeathToTeam: (state, action) => {
		action.team.deaths++;
		return { ...state };
	},
	AddTeammate: (state, action) => {
		action.team.members.push(action.player);
		return { ...state };
	},

	RemoveTeammateAction: (state, action) => {
		action.team.members.iter().filter((current) => current !== action.player);
		return { ...state };
	},

	EnlistTeam: (state, action) => {
		return { ...state, teams: Vec.vec(...[action.team, ...state.teams.asPtr()]) };
	},
});
