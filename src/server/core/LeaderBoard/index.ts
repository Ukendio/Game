import Rodux from "@rbxts/rodux";
import { leaderBoardReducer } from "./reducer";
export * from "./actions";
export const roundStore = new Rodux.Store(leaderBoardReducer);
