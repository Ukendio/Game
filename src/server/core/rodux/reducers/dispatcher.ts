import Rodux from "@rbxts/rodux";
import { Vec } from "@rbxts/rust-classes";

export interface DispatcherState {
	deployedPlayers: Vec<Player>;
}

export type DispatcherActions =
	| {
			type: "Deploy";
			player: Player;
	  }
	| {
			type: "Depart";
			player: Player;
	  };

export const dispatcherState = {
	deployedPlayers: Vec.vec<Player>(),
};

export const dispatcherReducer = Rodux.createReducer<DispatcherState, DispatcherActions>(dispatcherState, {
	Deploy: (state, action) => {
		if (action.player.Parent !== undefined) {
			return { ...state, deployedPlayers: state.deployedPlayers.push(action.player) };
		}
		return state;
	},

	Depart: (state, action) => {
		return {
			...state,
			deployedPlayers: state.deployedPlayers
				.iter()
				.filter((player) => player !== action.player)
				.collect(),
		};
	},
});
