import { Store } from "@rbxts/rodux";
import { Result, Option } from "@rbxts/rust-classes";
import { Actions, State } from "server/core/rodux/store";

export function findSpawn(store: Store<State, Actions>): Option<SpawnLocation> {
	let closestSpawn: Option<SpawnLocation> = Option.none();

	let closestMagnitude: Option<number> = Option.none();

	store.getState().election.spawnLocations.forEach((spawnLocation) => {
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

		if (closestMagnitude.unwrapOr(-1) > totalMagnitude) {
			closestMagnitude = Option.some(totalMagnitude);
			closestSpawn = Option.some(spawnLocation);
		}
	});

	return closestSpawn;
}
