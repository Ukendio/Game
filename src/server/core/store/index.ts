import Rodux from "@rbxts/rodux";

import { State, reducer } from "./reducer";
import { Actions } from "./actions";

export default new Rodux.Store<State, Actions>(reducer);
