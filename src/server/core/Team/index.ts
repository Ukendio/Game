import Rodux from "@rbxts/rodux";
import { teamReducer } from "./reducer";
export * from "./actions";
export const teamStore = new Rodux.Store(teamReducer);
