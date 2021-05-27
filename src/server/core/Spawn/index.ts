export * from "./actions";
import Rodux from "@rbxts/rodux";
import { spawnReducer } from "./reducer";

export const spawnStore = new Rodux.Store(spawnReducer);
