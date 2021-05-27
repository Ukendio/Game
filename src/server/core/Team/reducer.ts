import Rodux from "@rbxts/rodux";
import {
	PlayerTeam,
	AddTeammateAction,
	AddKillToTeamAction,
	EnlistAction,
	RemoveTeammateAction,
	AddDeathToTeamAction,
} from "./actions";
import { copyShallow } from "shared/tableUtil";

interface State {
	teams: PlayerTeam[];
}
const initialState: State = {
	teams: [],
};

type Actions = AddTeammateAction | RemoveTeammateAction | AddKillToTeamAction | AddDeathToTeamAction | EnlistAction;
export const teamReducer = Rodux.createReducer<State, Actions>(initialState, {
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
