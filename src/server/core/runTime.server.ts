import { ServerScriptService, Workspace, Players, ReplicatedStorage } from "@rbxts/services";
import { CharacterRigR15, yieldForR15CharacterDescendants } from "@rbxts/yield-for-character";
import FabricLib from "@rbxts/fabric";
import Remotes from "shared/remotes";
import { getKeys } from "shared/tableUtil";
import { mapNames } from "shared/Architect/maps";

import store from "./store";
import { deploy, selectGameMode, selectMap, startRound } from "./Store/Round";
import { castVote, createTopic, startVote, stopVote } from "./Store/Council";
import { mapLoadAsync } from "shared/Architect/Loader";
import { gameModes } from "shared/gameModes";
import { setSpawnLocations } from "./Store/Spawn";

const ServerCreateHealthPack = Remotes.Server.Create("ServerCreateHealthPack");
const ServerCreatePistol = Remotes.Server.Create("ServerCreatePistol");
const ClientRequestDeploy = Remotes.Server.Create("ClientRequestDeploy");
const CouncilVoteOn = Remotes.Server.Create("CouncilVoteOn");
const CouncilStopVote = Remotes.Server.Create("CouncilStopVote");
const UIScoreboardUpdate = Remotes.Server.Create("UIScoreboardUpdate");
const ClientAppendVote = Remotes.Server.Create("ClientAppendVote");
const RoundStarted = Remotes.Server.Create("RoundStarted");

const fabric = new FabricLib.Fabric("Example");
{
	FabricLib.useReplication(fabric);
	FabricLib.useTags(fabric);
	FabricLib.useBatching(fabric);
	fabric.registerUnitsIn(ServerScriptService.TS.units);
	fabric.DEBUG = true;
}

function createHealthPack(character: CharacterRigR15) {
	const healthPack = ReplicatedStorage.TS.assets.Heal.Clone();
	healthPack.Parent = Workspace;
	healthPack.SetPrimaryPartCFrame(
		healthPack
			.GetPrimaryPartCFrame()
			.sub(healthPack.PrimaryPart!.Position)
			.add(character.HumanoidRootPart.Position),
	);

	const c = fabric.getOrCreateUnitByRef("Heal", healthPack);
	c.mergeBaseLayer({});
	c.onUpdated = function (this) {};

	ServerCreateHealthPack.SendToAllPlayersExcept(Players.GetPlayerFromCharacter(character)!, healthPack);

	Promise.delay(30).then(() => {
		healthPack.Destroy();
	});
}

function createPistol(character: CharacterRigR15) {
	const player = Players.GetPlayerFromCharacter(character)!;
	const backpack = player.WaitForChild("Backpack");

	for (const [_, tool] of pairs(backpack.GetChildren())) {
		tool.Destroy();
	}

	const gunTool = ReplicatedStorage.TS.assets.FindFirstChild("Pistol")?.Clone() as Tool;
	gunTool.Parent = backpack;

	const gun = fabric.getOrCreateUnitByRef("Gun", gunTool);
	gun.mergeBaseLayer({});

	ServerCreatePistol.SendToPlayer(player, gunTool);
}

function respawnPlayer(currentPlayer?: Player) {
	if (currentPlayer === undefined) return;

	const state = store.getState().Spawn;

	let closestSpawn = undefined! as SpawnLocation;

	let closestMagnitude = undefined! as number;

	state.spawnLocations.forEach((spawnLocation) => {
		let totalMagnitude = 0;
		state.players.forEach((player) => {
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

	new Promise<void>((resolve) => {
		currentPlayer.LoadCharacter();
		resolve();
	}).then(() => {
		if (currentPlayer.Character) handleCharacterAdded(currentPlayer.Character);
		currentPlayer.CharacterAdded.Connect(handleCharacterAdded);
	});
}

async function handleCharacterAdded(character: Model) {
	const rig = await yieldForR15CharacterDescendants(character);
	rig.Humanoid.Health = 20;

	rig.Humanoid.Died.Connect(() => {
		createHealthPack(rig);
		respawnPlayer(Players.GetPlayerFromCharacter(rig));
	});

	createPistol(rig);

	return rig;
}

const onPlayerAdded = (player: Player) => {
	const wyvernAbilities = fabric.getOrCreateUnitByRef("Wyvern", player);
	wyvernAbilities.mergeBaseLayer({});

	respawnPlayer(player);
};

for (const player of Players.GetPlayers()) {
	onPlayerAdded(player);
}

Players.PlayerAdded.Connect(onPlayerAdded);
Players.PlayerRemoving.Connect((player) => {
	UIScoreboardUpdate.SendToAllPlayersExcept(player, player.Name);
});

ClientRequestDeploy.SetCallback((player) => {
	const state = store.getState().Round;
	if (state.sequence === "started") {
		if (state.deployedPlayers.find((val) => val === player)) return false;

		store.dispatch(deploy(player));
		if (player.Character) {
			respawnPlayer(player);
			return player.Character;
		}
	}

	return false;
});

ClientAppendVote.Connect((player, vote) => {
	store.dispatch(castVote(player, vote));
});

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
		.Round.winCondition()
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
			CouncilVoteOn.SendToAllPlayers(store.getState().Council.topic);

			await Promise.delay(1).then(() => {
				const state = store.getState().Council;
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
			CouncilVoteOn.SendToAllPlayers(store.getState().Council.topic);

			await Promise.delay(1).then(() => {
				const state = store.getState().Council;
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
