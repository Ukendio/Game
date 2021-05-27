import Rodux from "@rbxts/rodux";
import { councilReducer } from "./reducer";
export * from "./actions";
export const councilStore = new Rodux.Store(councilReducer);
