import Rodux from "@rbxts/rodux";

export interface RoundState {
	sequence: "started" | "intermission";
}

export type RoundActions =
	| {
			type: "StartRound";
	  }
	| {
			type: "StopRound";
	  };

export const initialState = {
	sequence: "intermission" as const,
};

export const roundReducer = Rodux.createReducer<RoundState, RoundActions>(initialState, {
	StartRound: (state) => {
		if (state.sequence === "intermission") {
			return { ...state, sequence: "started" };
		}

		return state;
	},

	StopRound: (state) => {
		if (state.sequence === "started") {
			return { ...state, sequence: "intermission" };
		}
		return state;
	},
});
