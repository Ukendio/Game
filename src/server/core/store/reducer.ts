import Rodux, { Store } from "@rbxts/rodux";
import { Vec } from "@rbxts/rust-classes";
import { gameModes } from "server/core/gameModes";
import { copyShallow } from "shared/tableUtil";
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
		const newState = copyShallow<State>(state);
		newState.ranking.iter().forEach((current) => {
			if (current.player === action.player) {
				current.kills++;
			}
		});

		return newState;
	},

	AddDeathToPlayer: (state, action) => {
		const newState = copyShallow<State>(state);
		newState.ranking.iter().forEach((current) => {
			if (current.player === action.player) {
				current.deaths++;
			}
		});

		return newState;
	},

	StartVote: (state) => {
		const newState = copyShallow<State>(state);
		newState.voting = true;
		state.topic.options.iter().forEach((index) => {
			newState.votes[index] = 0;
		});
		return newState;
	},

	StopVote: (state) => {
		assert(state.voting === true, "Cannot stop a voting that is not ongoing");

		const newState = copyShallow<State>(state);
		newState.voting = false;
		newState.topic = undefined!;
		newState.votes = {};
		newState.hasVoted = Vec.vec();

		return newState;
	},

	CastVote: (state, action) => {
		const newState = copyShallow<State>(state);
		newState.votes[action.vote]++;
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
		table.sort(ranking.asPtr(), (a, b) => a.kills < b.kills);

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
		newState.deployedPlayers
			.iter()
			.filter((player) => player !== action.player)
			.collect();

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
		const team = newState.teams.iter().find((team) => team === action.team);
		team.map((playerTeam) => playerTeam.kills++);

		return newState;
	},

	AddDeathToTeam: (state, action) => {
		const newState = copyShallow<State>(state);
		const team = newState.teams.iter().find((team) => team === action.team);
		team.map((playerTeam) => playerTeam.kills++);

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
