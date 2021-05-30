import FabricLib from "@rbxts/fabric";
import { ServerScriptService, Players } from "@rbxts/services";
import yieldForR15CharacterDescendants from "@rbxts/yield-for-character";
import { createHero } from "server/core/factory/createClass";
import { createGun } from "server/core/factory/createGun";
import { createHealthPack } from "server/core/factory/createHealthPack";

import store from "server/core/store";

const fabric = new FabricLib.Fabric("Game");
{
	FabricLib.useReplication(fabric);
	FabricLib.useTags(fabric);
	FabricLib.useBatching(fabric);
	fabric.registerUnitsIn(ServerScriptService.TS.units);
	fabric.DEBUG = true;
}

export function respawnPlayer(currentPlayer: Player) {
	const state = store.getState();

	let closestSpawn = undefined! as SpawnLocation;

	let closestMagnitude = undefined! as number;

	state.spawnLocations.forEach((spawnLocation) => {
		let totalMagnitude = 0;
		state.deployedPlayers.forEach((player) => {
			const root = player.Character?.FindFirstChild("HumanoidRootPart") as BasePart;
			if (root) {
				totalMagnitude += spawnLocation.Position.sub(root.Position).Magnitude;
			}
		});

		if (closestMagnitude === undefined) {
			closestMagnitude = totalMagnitude;
		}

		if (totalMagnitude < closestMagnitude) {
			closestMagnitude = totalMagnitude;
			closestSpawn = spawnLocation;
		}
	});

	currentPlayer.RespawnLocation = closestSpawn;

	new Promise<Player>((resolve) => {
		currentPlayer.LoadCharacter();
		resolve(currentPlayer);
	}).then((player) => {
		if (player.Character) handleCharacterAdded(player.Character);
		else player.CharacterAdded.Connect(handleCharacterAdded);
	});
}

async function handleCharacterAdded(character: Model) {
	const rig = await yieldForR15CharacterDescendants(character);
	rig.Humanoid.Health = 20;
	const player = Players.GetPlayerFromCharacter(rig)!;
	createGun(fabric, player);
	createHero(fabric, player);

	rig.Humanoid.Died.Connect(() => {
		createHealthPack(fabric, player);
		respawnPlayer(player);
	});

	return rig;
}

const onPlayerAdded = (player: Player) => {
	respawnPlayer(player);
};

for (const player of Players.GetPlayers()) {
	onPlayerAdded(player);
}

Players.PlayerAdded.Connect(onPlayerAdded);
