import Rodux from "@rbxts/rodux";
import { competitorReducer } from "./reducer";
export * from "./actions";
export const competitorStore = new Rodux.Store(competitorReducer);
