import Rodux from "@rbxts/rodux";
import { DispatcherActions, dispatcherReducer, dispatcherState, DispatcherState } from "./reducers/dispatcher";
import { ElectionActions, electionReducer, electionState, ElectionState } from "./reducers/election";
import { RoundActions, round_reducer, roundState, RoundState } from "./reducers/round";
import { ScoreActions, scoreReducer, scoreState, ScoreState } from "./reducers/score";
import { TeamActions, teamReducer, teamState, TeamState } from "./reducers/team";

export interface State {
	dispatcher: DispatcherState;
	election: ElectionState;
	round: RoundState;
	score: ScoreState;
	team: TeamState;
}
export type Actions = DispatcherActions | ElectionActions | RoundActions | ScoreActions | TeamActions;

const initialState = identity<State>({
	dispatcher: dispatcherState,
	election: electionState,
	round: roundState,
	score: scoreState,
	team: teamState,
});

const reducer = Rodux.combineReducers({
	dispatcher: dispatcherReducer,
	election: electionReducer,
	round: round_reducer,
	score: scoreReducer,
	team: teamReducer,
});

export default new Rodux.Store(reducer, initialState);
