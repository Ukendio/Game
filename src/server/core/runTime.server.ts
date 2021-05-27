import { ServerScriptService, Workspace, Players, ReplicatedStorage } from "@rbxts/services";
import { CharacterRigR15, yieldForR15CharacterDescendants } from "@rbxts/yield-for-character";
import FabricLib from "@rbxts/fabric";
import Remotes from "shared/remotes";
import { spawnStore } from "./Spawn";
import { castVote, councilStore, createTopic, startVote, stopVote } from "server/core/Council";
import { mapLoadAsync } from "shared/Architect/Loader";
import { selectGameMode, selectMap } from "./Round/actions";
import { gameModes } from "shared/gameModes";
import { roundStore, deploy, startRound } from "./Round";
import { getKeys } from "shared/tableUtil";
import { mapNames } from "shared/Architect/maps";

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

	const state = spawnStore.getState();

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
	const state = roundStore.getState();
	if (state.sequence === "started") {
		if (roundStore.getState().deployedPlayers.find((val) => val === player)) return false;

		roundStore.dispatch(deploy(player));
		if (player.Character) {
			respawnPlayer(player);
		}
		return true;
	}

	return false;
});

ClientAppendVote.Connect((player, vote) => {
	councilStore.dispatch(castVote(player, vote));
});

function getVoteOrDefault(votes: string[], options: string[]) {
	const result = [...votes];
	const getHighestVote = result
		.sort((a, b) => result.filter((v) => v === a).size() < result.filter((v) => v === b).size())
		.pop();

	return getHighestVote ?? options[new Random().NextInteger(0, options.size() - 1)];
}

async function startGame() {
	roundStore.dispatch(startRound());
	RoundStarted.SendToAllPlayers();
	return roundStore
		.getState()
		.winCondition()
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
			councilStore.dispatch(
				createTopic({
					name: "Map",
					options: mapNames,
				}),
			);
			councilStore.dispatch(startVote());
			CouncilVoteOn.SendToAllPlayers(councilStore.getState().topic);

			await Promise.delay(10).then(() => {
				const state = councilStore.getState();
				const vote = getVoteOrDefault(state.votes, state.topic.options);
				print(vote);
				mapLoadAsync(vote);

				roundStore.dispatch(selectMap(vote));
				councilStore.dispatch(stopVote());

				CouncilStopVote.SendToAllPlayers();
			});
		})
		.then(async () => {
			councilStore.dispatch(
				createTopic({
					name: "Gamemode",
					options: [...getKeys(gameModes)],
				}),
			);

			councilStore.dispatch(startVote());
			CouncilVoteOn.SendToAllPlayers(councilStore.getState().topic);

			await Promise.delay(10).then(() => {
				const state = councilStore.getState();
				const vote = getVoteOrDefault(state.votes, state.topic.options) as keyof typeof gameModes;

				roundStore.dispatch(selectGameMode(vote));
				councilStore.dispatch(stopVote());

				CouncilStopVote.SendToAllPlayers();
			});
		})
		.then(() => startGame())
		.expect();
}

while (true) {
	intermission();
}
