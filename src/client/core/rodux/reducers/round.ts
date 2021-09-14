import Rodux from "@rbxts/rodux";

export enum Sequence {
	Started,
	Intermission,
}

export interface RoundState {
	sequence: Sequence;
}

export type RoundActions =
	| {
			type: "start_round";
	  }
	| {
			type: "stop_round";
	  };

export const round_state = {
	sequence: Sequence.Intermission,
};

export const round_reducer = Rodux.createReducer<RoundState, RoundActions>(round_state, {
	start_round: (state) => {
		return { ...state, sequence: Sequence.Started };
	},
	stop_round: (state) => {
		return { ...state, sequence: Sequence.Intermission };
	},
});
