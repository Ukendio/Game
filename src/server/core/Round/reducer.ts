import Rodux from "@rbxts/rodux";
import { gameModes } from "shared/gameModes";
import { copyShallow } from "shared/tableUtil";

import { StartAction, DeployAction, DepartAction, StopAction, SelectGameModeAction, SelectMapAction } from "./actions";

interface State {
	sequence: "started" | "intermission";
	deployedPlayers: Player[];
	currentMap: string;
	gameMode: keyof typeof gameModes;
	winCondition: () => Promise<void>;
}

const initialState: State = {
	sequence: "intermission",
	deployedPlayers: new Array<Player>(),
	currentMap: undefined!,
	gameMode: undefined!,
	winCondition: undefined!,
};

type Actions = StartAction | DeployAction | DepartAction | StopAction | SelectGameModeAction | SelectMapAction;

export const roundReducer = Rodux.createReducer<State, Actions>(initialState, {
	Start: (state) => {
		if (state.sequence === "intermission") {
			const newState = copyShallow<State>(state);
			newState.sequence = "started";

			return newState;
		}

		return state;
	},
	Stop: (state) => {
		if (state.sequence === "started") {
			const newState = copyShallow<State>(state);
			newState.sequence = "intermission";

			return newState;
		}
		return state;
	},
	Deploy: (state, action) => {
		if (action.player.Parent !== undefined) {
			const newState = copyShallow<State>(state);
			newState.deployedPlayers.push(action.player);

			return newState;
		}
		return state;
	},
	Depart: (state, action) => {
		const newState = copyShallow<State>(state);
		newState.deployedPlayers.filter((player) => player !== action.player);

		return newState;
	},

	SelectGameMode: (state, action) => {
		const newState = copyShallow<State>(state);
		newState.gameMode = action.gameMode;
		newState.winCondition = gameModes[action.gameMode];

		return newState;
	},

	SelectMap: (state, action) => {
		const newState = copyShallow<State>(state);
		newState.currentMap = action.map;

		return newState;
	},
});
