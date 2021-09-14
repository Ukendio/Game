import Rodux, { Store } from "@rbxts/rodux";
import { Option, Vec } from "@rbxts/rust-classes";
import { State } from "server/core/rodux/store";
import { gamemodes } from "server/gamemodes";
import { Sequence, TopicFormat } from "shared/Types";
import { Actions } from "../store";

export interface ElectionState {
	voting: boolean;
	topic: Option<TopicFormat>;
	votes: Record<string, number>;
	has_voted: Vec<Player>;
	sequence: Sequence;
	gamemode: Option<keyof typeof gamemodes>;
	win_condition: Option<(store: Store<State, Actions>) => Promise<void>>;
	current_map: Option<string>;
	spawn_locations: Set<SpawnLocation>;
}

export type ElectionActions =
	| {
			type: "start_vote";
	  }
	| {
			type: "stop_vote";
	  }
	| {
			type: "create_topic";
			topic: Option<TopicFormat>;
	  }
	| {
			type: "cast_vote";
			player: Player;
			vote: string;
	  }
	| {
			type: "select_gamemode";
			selection: Option<string>;
	  }
	| {
			type: "select_map";
			selection: Option<string>;
	  }
	| {
			type: "set_spawn_locations";
			positions: Set<SpawnLocation>;
	  };

export const default_election_state = identity<ElectionState>({
	voting: false,
	topic: Option.none(),
	votes: {},
	has_voted: Vec.vec<Player>(),
	sequence: Sequence.Intermission,
	gamemode: Option.none<keyof typeof gamemodes>(),
	win_condition: Option.none(),
	current_map: Option.none(),
	spawn_locations: new Set<SpawnLocation>(),
});

export const election_reducer = Rodux.createReducer<ElectionState, ElectionActions>(default_election_state, {
	start_vote: (state) => {
		const new_state = identity<ElectionState>({
			...state,
			voting: true,
		});

		new_state.topic
			.expect("no topic has been selected")
			.options.iter()
			.forEach((a) => {
				new_state.votes[a] = 0;
			});

		return new_state;
	},

	stop_vote: (state) => {
		return { ...state, voting: false, topic: Option.none(), has_voted: state.has_voted.clear() };
	},

	cast_vote: (state, action) => {
		const newState = { ...state, hasVoted: state.has_voted.push(action.player) };
		newState.votes[action.vote]++;
		return newState;
	},

	create_topic: (state, action) => {
		return { ...state, topic: action.topic };
	},

	select_gamemode: (state, action) => {
		const newState = { ...state };
		newState.gamemode = action.selection as Option<keyof typeof gamemodes>;
		newState.win_condition = Option.some(
			gamemodes[action.selection.unwrapOr("Free For All") as keyof typeof gamemodes],
		);

		return newState;
	},

	select_map: (state, action) => {
		return { ...state, currentMap: action.selection };
	},

	set_spawn_locations: (state, action) => {
		if (action.positions !== undefined) {
			const newState = { ...state };
			newState.spawn_locations = action.positions;
			return newState;
		}
		return state;
	},
});
