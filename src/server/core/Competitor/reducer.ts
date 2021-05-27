import Rodux from "@rbxts/rodux";
import { AddDeathAction, AddKillAction } from "./actions";
import { copyShallow } from "shared/tableUtil";

export interface PlayerScore {
	player: Player;
	kills: number;
	deaths: number;
}

interface State {
	playerScores: PlayerScore[];
}

const initialState: State = {
	playerScores: [],
};

type Actions = AddKillAction | AddDeathAction;

export const competitorReducer = Rodux.createReducer<State, Actions>(initialState, {
	AddKillToPlayer: (state, action) => {
		const newState = copyShallow<State>(state);
		newState.playerScores.forEach((current) => {
			if (current.player === action.player) {
				current.kills += 1;
			}
		});

		return newState;
	},

	AddDeathToPlayer: (state, action) => {
		const newState = copyShallow<State>(state);
		newState.playerScores.forEach((current) => {
			if (current.player === action.player) {
				current.deaths += 1;
			}
		});

		return newState;
	},
});
