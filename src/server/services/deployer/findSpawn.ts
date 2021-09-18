import { Store } from "@rbxts/rodux";
import { Result, Option } from "@rbxts/rust-classes";
import { Actions, State } from "server/core/rodux/store";

export function findSpawn(store: Store<State, Actions>): Result<Option<SpawnLocation>, string> {
	//migrate current map to round reducer?
	if (store.getState().election.current_map.isNone()) return Result.err("No map has been elected");
	let closestSpawn: Option<SpawnLocation> = Option.none();

	let closestMagnitude: Option<number> = Option.none();

	store
		.getState()
		.election.spawn_locations.iter()
		.forEach((spawnLocation) => {
			let totalMagnitude = 0;
			store
				.getState()
				.dispatcher.deployedPlayers.iter()
				.forEach((player) => {
					const root = player.Character?.FindFirstChild("HumanoidRootPart") as BasePart;
					if (root) {
						totalMagnitude += spawnLocation.Position.sub(root.Position).Magnitude;
					}
				});

			if (closestMagnitude.isNone()) {
				closestMagnitude = Option.some(totalMagnitude);
			}

			if (closestMagnitude.unwrapOr(-1) < totalMagnitude) {
				closestMagnitude = Option.some(totalMagnitude);
				closestSpawn = Option.some(spawnLocation);
			}

			if (closestSpawn.isNone()) {
				closestSpawn = Option.some(spawnLocation);
			}
		});

	return Result.ok(closestSpawn);
}
