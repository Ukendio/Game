import Rodux from "@rbxts/rodux";

export interface AddKillAction extends Rodux.Action<"AddKillToPlayer"> {
	player: Player;
}

export function addKillToPlayer(player: Player): AddKillAction {
	return {
		type: "AddKillToPlayer",
		player: player,
	};
}

export interface AddDeathAction extends Rodux.Action<"AddDeathToPlayer"> {
	player: Player;
}

export function addDeathToPlayer(player: Player): AddDeathAction {
	return {
		type: "AddDeathToPlayer",
		player: player,
	};
}
