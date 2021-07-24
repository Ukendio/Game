import { Result, Option } from "@rbxts/rust-classes";
import store from "server/core/rodux/store";

export function findSpawn(): Result<Option<SpawnLocation>, string> {
	let closestSpawn: Option<SpawnLocation> = Option.none();

	let closestMagnitude: Option<number> = Option.none();

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

		if (closestMagnitude.isNone()) {
			closestMagnitude = Option.some(totalMagnitude);
		}

		if (closestMagnitude.unwrapOrElse(() => -1) > totalMagnitude) {
			closestMagnitude = Option.some(totalMagnitude);
			closestSpawn = Option.some(spawnLocation);
		}
	});

	return Result.ok(closestSpawn);
}
