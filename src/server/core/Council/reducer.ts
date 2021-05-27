import Rodux from "@rbxts/rodux";
import { copyShallow } from "shared/tableUtil";
import { CreateTopicAction, StartVoteAction, StopVoteAction, CastVoteAction, TopicFormat } from "./actions";

type Actions = StartVoteAction | StopVoteAction | CreateTopicAction | CastVoteAction;

interface State {
	voting: boolean;
	topic: TopicFormat;
	votes: string[];
	hasVoted: Player[];
}
const initialState: State = {
	voting: false,
	topic: undefined!,
	votes: [],
	hasVoted: [],
};

export const councilReducer = Rodux.createReducer<State, Actions>(initialState, {
	CreateTopic: (state, action) => {
		assert(state.voting === false, "Cannot have an ongoing vote before creating topic");

		const newState = copyShallow<State>(state);
		newState.topic = action.topic;

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
});
