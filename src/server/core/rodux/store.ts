import Rodux from "@rbxts/rodux";
import { DispatcherActions, dispatcherReducer, DispatcherState } from "./reducers/dispatcher";
import { ElectionActions, electionReducer, ElectionState } from "./reducers/election";
import { RoundActions, roundReducer, RoundState } from "./reducers/round";
import { ScoreActions, scoreReducer, ScoreState } from "./reducers/score";
import { TeamActions, teamReducer, TeamState } from "./reducers/team";

export interface State extends DispatcherState, ElectionState, RoundState, ScoreState, TeamState {}

type Actions = DispatcherActions | ElectionActions | RoundActions | ScoreActions | TeamActions;

const reducer = Rodux.combineReducers<State, Actions>({
	dispatcher: dispatcherReducer,
	election: electionReducer,
	round: roundReducer,
	score: scoreReducer,
	team: teamReducer,
} as never);

export default new Rodux.Store<State, Actions>(reducer);
