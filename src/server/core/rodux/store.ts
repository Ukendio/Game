import Rodux from "@rbxts/rodux";
import { DispatcherActions, dispatcherReducer, dispatcherState, DispatcherState } from "./reducers/dispatcher";
import { ElectionActions, electionReducer, electionState, ElectionState } from "./reducers/election";
import { RoundActions, roundReducer, roundState, RoundState } from "./reducers/round";
import { ScoreActions, scoreReducer, scoreState, ScoreState } from "./reducers/score";
import { TeamActions, teamReducer, teamState, TeamState } from "./reducers/team";

type State = DispatcherState & ElectionState & RoundState & ScoreState & TeamState;

type Actions = DispatcherActions | ElectionActions | RoundActions | ScoreActions | TeamActions;

const initialState = identity<State>({
	...dispatcherState,
	...electionState,
	...roundState,
	...scoreState,
	...teamState,
});

const reducer = Rodux.combineReducers({
	dispatcher: dispatcherReducer,
	election: electionReducer,
	round: roundReducer,
	score: scoreReducer,
	team: teamReducer,
});

export default new Rodux.Store<State, Actions>(reducer as never, initialState);
