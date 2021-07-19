import store from "server/core/rodux/store";

export async function findSpawn(player: Player) {
	let closestSpawn = undefined! as SpawnLocation;

	let closestMagnitude = undefined! as number;

	store.getState().spawnLocations.forEach((spawnLocation) => {
		let totalMagnitude = 0;
		store
			.getState()
			.deployedPlayers.iter()
			.forEach((player) => {
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

	player.RespawnLocation = closestSpawn;
}
