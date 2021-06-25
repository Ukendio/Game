import Rodux from "@rbxts/rodux";

import { State, reducer } from "shared/Rodux/reducer";
import { Actions } from "shared/Rodux/actions";

export default new Rodux.Store<State, Actions>(reducer);
