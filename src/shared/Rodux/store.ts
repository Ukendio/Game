import Rodux from "@rbxts/rodux";

import { State, reducer } from "shared/rodux/reducer";
import { Actions } from "shared/rodux/actions";

export default new Rodux.Store<State, Actions>(reducer);
