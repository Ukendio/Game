import { State } from "shared/Rodux/reducer";

export async function findSpawn(state: State, player: Player) {
	let closestSpawn = undefined! as SpawnLocation;

	let closestMagnitude = undefined! as number;

	state.spawnLocations.forEach((spawnLocation) => {
		let totalMagnitude = 0;
		state.deployedPlayers.iter().forEach((player) => {
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
