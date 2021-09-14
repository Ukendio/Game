import Rodux from "@rbxts/rodux";
import { TeamActions, teamReducer, TeamState } from "./reducers/team";
import { RoundActions, RoundState, round_reducer } from "./reducers/round";

export interface State {
	team: TeamState;
	round: RoundState;
}

type Actions = TeamActions | RoundActions;

const reducer = Rodux.combineReducers<State, Actions>({
	team: teamReducer,
	round: round_reducer,
});

export default new Rodux.Store<State, Actions>(reducer);
