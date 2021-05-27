import Rodux from "@rbxts/rodux";
import { copyShallow } from "shared/tableUtil";
import { PlayerScore } from "../Competitor/reducer";
import { AddPlayerToBoardAction, ChangeRankingAction } from "./actions";

type Actions = AddPlayerToBoardAction | ChangeRankingAction;

interface State {
	ranking: PlayerScore[];
}

const initialState: State = {
	ranking: [],
};

export const leaderBoardReducer = Rodux.createReducer<State, Actions>(initialState, {
	AddPlayerToBoard: (state, action) => {
		const newState = copyShallow<State>(state);
		newState.ranking.push(action.playerScore);

		return newState;
	},

	ChangeRanking: (state) => {
		const newState = copyShallow<State>(state);
		const ranking = newState.ranking;
		ranking.sort((a, b) => a.kills < b.kills);

		return newState;
	},
});
