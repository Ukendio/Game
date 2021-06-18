import { registerListenerIn } from "shared/registerListenersIn";
registerListenerIn(script.FindFirstChild("listeners")!);

import Remotes from "shared/remotes";
import { getKeys } from "shared/tableUtil";
import { mapNames } from "shared/Architect/maps";
import store from "./store";
import { loadMap } from "shared/Architect/Loader";
import { gameModes } from "server/core/gameModes";
import {
	startRound,
	createTopic,
	startVote,
	setSpawnLocations,
	selectMap,
	stopVote,
	selectGameMode,
} from "./store/actions";
import { Iterator, Vec } from "@rbxts/rust-classes";
import { State } from "./store/reducer";
import Object from "@rbxts/object-utils";

const CouncilVoteOn = Remotes.Server.Create("CouncilVoteOn");
const CouncilStopVote = Remotes.Server.Create("CouncilStopVote");
const RoundStarted = Remotes.Server.Create("RoundStarted");

function getVoteOrDefault<T extends string>(votes: Record<T, number>, options: Vec<T>): T {
	return Iterator.fromItems(...pairs(votes))
		.maxBy(([_a, aCount], [_b, bCount]) => aCount - bCount)
		.map(([name]) => name)
		.or(options.last())
		.unwrap();
}

async function startGame() {
	store.dispatch(startRound());
	RoundStarted.SendToAllPlayers();

	return store
		.getState()
		.winCondition(store)
		.andThenCall(Promise.delay, 5)
		.then(() => {
			//prompt MVP
			print("prompt");
		})
		.then(() => intermission);
}

function intermission() {
	//CLIENT_USER_RETURN_TO_MENU::PROMPT

	return Promise.delay(5)
		.then(async () => {
			store.dispatch(
				createTopic({
					name: "Map",
					options: mapNames,
				}),
			);
			store.dispatch(startVote());
			CouncilVoteOn.SendToAllPlayers(store.getState().topic);

			await Promise.delay(1).then(() => {
				const state = store.getState();
				const vote = getVoteOrDefault(state.votes, Vec.vec(...state.topic.options));
				const currentMap = loadMap(vote);

				const spawnLocations = new Set<SpawnLocation>();
				for (const smartSpawn of currentMap.FindFirstChild("Spawns")!.GetChildren()) {
					spawnLocations.add(smartSpawn.FindFirstChildOfClass("SpawnLocation")!);
				}

				store.dispatch(setSpawnLocations(spawnLocations));
				store.dispatch(selectMap(currentMap.Name));
				store.dispatch(stopVote());
				CouncilStopVote.SendToAllPlayers();
			});
		})
		.then(async () => {
			store.dispatch(
				createTopic({
					name: "Gamemode",
					options: [...getKeys(gameModes)],
				}),
			);

			store.dispatch(startVote());
			CouncilVoteOn.SendToAllPlayers(store.getState().topic);

			await Promise.delay(1).then(() => {
				const state = store.getState();
				const vote = getVoteOrDefault(state.votes, Vec.vec(...state.topic.options)) as keyof typeof gameModes;

				store.dispatch(selectGameMode(vote));
				store.dispatch(stopVote());

				CouncilStopVote.SendToAllPlayers();
			});
		})
		.then(() => startGame())
		.expect();
}

while (true) {
	intermission();
}
