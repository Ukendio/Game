import Rodux from "@rbxts/rodux";
import { Sequence } from "shared/Types";

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

export const roundState = {
	sequence: Sequence.Intermission,
};

export const round_reducer = Rodux.createReducer<RoundState, RoundActions>(roundState, {
	start_round: (state) => {
		if (state.sequence === Sequence.Intermission) {
			print("change state");
			return { ...state, sequence: Sequence.Started };
		}

		return state;
	},

	stop_round: (state) => {
		if (state.sequence === Sequence.Started) {
			return { ...state, sequence: Sequence.Intermission };
		}
		return state;
	},
});
