import Rodux from "@rbxts/rodux";
import { Vec } from "@rbxts/rust-classes";
import { PlayerScore } from "shared/Types";

export interface ScoreState {
	ranking: Vec<PlayerScore>;
}

export type ScoreActions =
	| {
			type: "AddKillToPlayer";
			player: Player;
	  }
	| {
			type: "AddDeathToPlayer";
			player: Player;
	  }
	| {
			type: "ChangeRanking";
	  };

export const scoreState = {
	ranking: Vec.vec<PlayerScore>(),
};

export const scoreReducer = Rodux.createReducer<ScoreState, ScoreActions>(scoreState, {
	AddKillToPlayer: (state, action) => {
		state.ranking
			.iter()
			.find((current) => current.player === action.player)
			.map((player) => player.kills++);

		return { ...state };
	},

	AddDeathToPlayer: (state, action) => {
		state.ranking
			.iter()
			.find((current) => current.player === action.player)
			.map((player) => player.deaths++);

		return { ...state };
	},
	ChangeRanking: (state) => {
		table.sort(state.ranking.asPtr(), (a, b) => a.kills < b.kills);

		return { ...state };
	},
});
