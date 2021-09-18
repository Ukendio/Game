import FFA_WIN_CONDITION from "./modeBuilder/freeForAll";
import KC_WIN_CONDITION from "./modeBuilder/killConfirmed";
import TDM_WIN_CONDITION from "./modeBuilder/freeForAll";

export const gamemodes = {
	["Free For All"]: FFA_WIN_CONDITION,
	["Kill Confirmed"]: KC_WIN_CONDITION,
	["Team Deathmatch"]: TDM_WIN_CONDITION,
};
