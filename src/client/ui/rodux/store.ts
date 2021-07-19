import Rodux from "@rbxts/rodux";
import { TeamActions, teamReducer, TeamState } from "./reducers/team";

export interface State extends TeamState {}

type Actions = TeamActions;

const reducer = Rodux.combineReducers<State, Actions>({
	team: teamReducer,
} as never);

export default new Rodux.Store<State, Actions>(reducer);
