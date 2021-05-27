import Rodux from "@rbxts/rodux";

export interface AddPlayerToTableAction extends Rodux.Action<"AddPlayerToTable"> {
	player: Player;
}

export function addPlayerToTable(player: Player): AddPlayerToTableAction {
	return {
		type: "AddPlayerToTable",
		player: player,
	};
}

export interface SetSpawnLocationsAction extends Rodux.Action<"SetSpawnLocations"> {
	positions: Set<SpawnLocation>;
}

export function setSpawnLocations(positions: Set<SpawnLocation>): SetSpawnLocationsAction {
	return {
		type: "SetSpawnLocations",
		positions: positions,
	};
}

export interface RespawnPlayerAction extends Rodux.Action<"RespawnPlayer"> {
	player: Player;
}

export function respawnPlayer(player: Player): RespawnPlayerAction {
	return {
		type: "RespawnPlayer",
		player: player,
	};
}
