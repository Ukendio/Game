import Rodux from "@rbxts/rodux";
import { copyShallow } from "shared/tableUtil";
import { AddPlayerToTableAction, SetSpawnLocationsAction, RespawnPlayerAction } from "./actions";

type Actions = AddPlayerToTableAction | SetSpawnLocationsAction;

interface State {
	spawnLocations: Set<SpawnLocation>;
	players: Set<Player>;
}

const initialState: State = {
	spawnLocations: new Set<SpawnLocation>(),
	players: new Set<Player>(),
};

export const spawnReducer = Rodux.createReducer<State, Actions>(initialState, {
	AddPlayerToTable: (state, action) => {
		if (action.player.Parent !== undefined) {
			const newState = copyShallow<State>(state);
			newState.players.add(action.player);

			return newState;
		}

		return state;
	},
	SetSpawnLocations: (state, action) => {
		if (action.positions !== undefined) {
			const newState = copyShallow<State>(state);
			newState.spawnLocations = action.positions;
			return newState;
		}
		return state;
	},
});
