import Rodux from "@rbxts/rodux";
import { gameModes } from "shared/gameModes";

export interface DeployAction extends Rodux.Action<"Deploy"> {
	player: Player;
}

export function deploy(player: Player): DeployAction {
	return {
		type: "Deploy",
		player: player,
	};
}

export interface DepartAction extends Rodux.Action<"Depart"> {
	player: Player;
}

export function depart(player: Player): DepartAction {
	return {
		type: "Depart",
		player: player,
	};
}

export interface StartAction extends Rodux.Action<"Start"> {}

export function startRound(): StartAction {
	return {
		type: "Start",
	};
}

export interface StopAction extends Rodux.Action<"Stop"> {}

export function stopRound(): StopAction {
	return {
		type: "Stop",
	};
}

export interface SelectGameModeAction extends Rodux.Action<"SelectGameMode"> {
	gameMode: keyof typeof gameModes;
}

export function selectGameMode(gameMode: keyof typeof gameModes): SelectGameModeAction {
	return {
		type: "SelectGameMode",
		gameMode: gameMode,
	};
}

export interface SelectMapAction extends Rodux.Action<"SelectMap"> {
	map: string;
}

export function selectMap(map: string): SelectMapAction {
	return {
		type: "SelectMap",
		map: map,
	};
}
