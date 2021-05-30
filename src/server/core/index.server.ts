import { registerListenerIn } from "../../shared/registerListenersIn";
registerListenerIn(script.FindFirstChild("listeners")!);

import Remotes from "shared/remotes";
import { getKeys } from "shared/tableUtil";
import { mapNames } from "shared/Architect/maps";
import store from "./store";
import { mapLoadAsync } from "shared/Architect/Loader";
import { gameModes } from "shared/gameModes";
import {
	startRound,
	createTopic,
	startVote,
	setSpawnLocations,
	selectMap,
	stopVote,
	selectGameMode,
} from "./store/actions";

const CouncilVoteOn = Remotes.Server.Create("CouncilVoteOn");
const CouncilStopVote = Remotes.Server.Create("CouncilStopVote");
const RoundStarted = Remotes.Server.Create("RoundStarted");

function getVoteOrDefault(votes: string[], options: string[]) {
	const result = [...votes];
	const getHighestVote = result
		.sort((a, b) => result.filter((v) => v === a).size() < result.filter((v) => v === b).size())
		.pop();

	return getHighestVote ?? options[new Random().NextInteger(0, options.size() - 1)];
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
				const vote = getVoteOrDefault(state.votes, state.topic.options);
				const currentMap = mapLoadAsync(vote);
				const spawnLocations = new Set<SpawnLocation>();
				for (const smartSpawn of currentMap.FindFirstChild("Spawns")!.GetChildren()) {
					spawnLocations.add(smartSpawn.FindFirstChildOfClass("SpawnLocation")!);
				}

				store.dispatch(setSpawnLocations(spawnLocations));
				store.dispatch(selectMap(vote));
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
				const vote = getVoteOrDefault(state.votes, state.topic.options) as keyof typeof gameModes;

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
