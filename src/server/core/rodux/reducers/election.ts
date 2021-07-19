import Rodux from "@rbxts/rodux";
import { Vec } from "@rbxts/rust-classes";
import { gameModes } from "server/gameModes";
import { TopicFormat } from "shared/Types";

export interface ElectionState {
	voting: boolean;
	topic: TopicFormat;
	votes: Record<string, number>;
	hasVoted: Vec<Player>;
	sequence: "started" | "intermission";
	gameMode: keyof typeof gameModes;
	winCondition: () => Promise<void>;
	currentMap: string;
	spawnLocations: Set<SpawnLocation>;
}

export type ElectionActions =
	| {
			type: "StartVote";
	  }
	| {
			type: "StopVote";
	  }
	| {
			type: "CreateTopic";
			topic: TopicFormat;
	  }
	| {
			type: "CastVote";
			player: Player;
			vote: string;
	  }
	| {
			type: "SelectGameMode";
			gameMode: keyof typeof gameModes;
	  }
	| {
			type: "SelectMap";
			map: string;
	  }
	| {
			type: "SetSpawnLocations";
			positions: Set<SpawnLocation>;
	  };

export const initialState = {
	voting: false,
	topic: undefined!,
	votes: {},
	hasVoted: Vec.vec<Player>(),
	sequence: "intermission" as const,
	gameMode: undefined!,
	winCondition: undefined!,
	currentMap: undefined!,
	spawnLocations: new Set<SpawnLocation>(),
};

export const electionReducer = Rodux.createReducer<ElectionState, ElectionActions>(initialState, {
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

	SelectGameMode: (state, action) => {
		const newState = { ...state };
		newState.gameMode = action.gameMode as keyof typeof gameModes;
		newState.winCondition = gameModes[action.gameMode as keyof typeof gameModes];

		return newState;
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
});
