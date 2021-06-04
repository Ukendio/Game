import Rodux, { Store } from "@rbxts/rodux";
import { gameModes } from "server/core/gameModes";
import { copyShallow } from "shared/tableUtil";
import { Actions, PlayerTeam, TopicFormat } from "./actions";

export interface PlayerScore {
	player: Player;
	kills: number;
	deaths: number;
}

export interface State {
	teams: PlayerTeam[];
	ranking: PlayerScore[];
	voting: boolean;
	topic: TopicFormat;
	votes: string[];
	hasVoted: Player[];
	sequence: "started" | "intermission";
	deployedPlayers: Player[];
	currentMap: string;
	gameMode: keyof typeof gameModes;
	winCondition: (store: Store<State, Actions>) => Promise<void>;
	spawnLocations: Set<SpawnLocation>;
}

const initialState: State = {
	teams: [],
	ranking: [],
	voting: false,
	topic: undefined!,
	votes: [],
	hasVoted: [],
	sequence: "intermission",
	deployedPlayers: new Array<Player>(),
	currentMap: undefined!,
	gameMode: undefined!,
	winCondition: undefined!,
	spawnLocations: new Set<SpawnLocation>(),
};

export const reducer = Rodux.createReducer<State, Actions>(initialState, {
	AddKillToPlayer: (state, action) => {
		const newState = copyShallow<State>(state);
		newState.ranking.forEach((current) => {
			if (current.player === action.player) {
				current.kills += 1;
			}
		});

		return newState;
	},

	AddDeathToPlayer: (state, action) => {
		const newState = copyShallow<State>(state);
		newState.ranking.forEach((current) => {
			if (current.player === action.player) {
				current.deaths += 1;
			}
		});

		return newState;
	},

	StartVote: (state) => {
		assert(state.voting === false, "Cannot start a vote when a vote is ongoing");
		const newState = copyShallow<State>(state);
		newState.voting = true;

		return newState;
	},

	StopVote: (state) => {
		assert(state.voting === true, "Cannot stop a voting that is not ongoing");

		const newState = copyShallow<State>(state);
		newState.voting = false;
		newState.topic = undefined!;
		newState.votes = [];
		newState.hasVoted = [];

		return newState;
	},

	CastVote: (state, action) => {
		assert(
			state.topic.options.find((option) => option === action.vote),
			"Was not available in options",
		);

		const newState = copyShallow<State>(state);
		newState.votes.push(action.vote);
		newState.hasVoted.push(action.player);
		return state;
	},
	CreateTopic: (state, action) => {
		assert(state.voting === false, "Cannot have an ongoing vote before creating topic");

		const newState = copyShallow<State>(state);
		newState.topic = action.topic;

		return newState;
	},
	AddPlayerToBoard: (state, action) => {
		const newState = copyShallow<State>(state);
		newState.ranking.push(action.playerScore);

		return newState;
	},

	ChangeRanking: (state) => {
		const newState = copyShallow<State>(state);
		const ranking = newState.ranking;
		ranking.sort((a, b) => a.kills < b.kills);

		return newState;
	},
	Deploy: (state, action) => {
		if (action.player.Parent !== undefined) {
			const newState = copyShallow<State>(state);
			newState.deployedPlayers.push(action.player);

			return newState;
		}
		return state;
	},
	Depart: (state, action) => {
		const newState = copyShallow<State>(state);
		newState.deployedPlayers.filter((player) => player !== action.player);

		return newState;
	},
	Start: (state) => {
		if (state.sequence === "intermission") {
			const newState = copyShallow<State>(state);
			newState.sequence = "started";

			return newState;
		}

		return state;
	},
	Stop: (state) => {
		if (state.sequence === "started") {
			const newState = copyShallow<State>(state);
			newState.sequence = "intermission";

			return newState;
		}
		return state;
	},

	SelectGameMode: (state, action) => {
		const newState = copyShallow<State>(state);
		newState.gameMode = action.gameMode;
		newState.winCondition = gameModes[action.gameMode];

		return newState;
	},

	SelectMap: (state, action) => {
		const newState = copyShallow<State>(state);
		newState.currentMap = action.map;

		return newState;
	},

	SetSpawnLocations: (state, action) => {
		if (action.positions !== undefined) {
			const newState = copyShallow<State>(state);
			newState.spawnLocations = action.positions;
			return newState;
		}
		return state;
	},
	AddKillToTeam: (state, action) => {
		const newState = copyShallow<State>(state);
		const team = newState.teams.find((team) => team === action.team);

		if (team) {
			team.kills += 1;
		}

		return newState;
	},

	AddDeathToTeam: (state, action) => {
		const newState = copyShallow<State>(state);
		const team = newState.teams.find((team) => team === action.team);

		if (team) {
			team.deaths += 1;
		}

		return newState;
	},
	AddTeammate: (state, action) => {
		const newState = copyShallow<State>(state);
		const team = action.team;

		team.members.push(action.player);

		return newState;
	},

	RemoveTeammateAction: (state, action) => {
		const newState = copyShallow<State>(state);
		const team = action.team;

		team.members.filter((current) => current !== action.player);

		return newState;
	},

	EnlistTeam: (state, action) => {
		const newState = copyShallow<State>(state);
		newState.teams.push(action.team);
		return newState;
	},
});
