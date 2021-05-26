import { ServerScriptService, Workspace, Players, ReplicatedStorage } from "@rbxts/services";
import { CharacterRigR15, yieldForR15CharacterDescendants } from "@rbxts/yield-for-character";
import FabricLib from "@rbxts/fabric";
import Remotes from "shared/Remotes";
import { spawnStore } from "./Spawn";

const ServerCreateHealthPack = Remotes.Server.Create("ServerCreateHealthPack");
const ClientRequestDeploy = Remotes.Server.Create("ClientRequestDeploy");

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

	Promise.delay(5).then(() => currentPlayer.LoadCharacter());
}

async function handleCharacterAdded(character: Model) {
	const rig = await yieldForR15CharacterDescendants(character);
	rig.Humanoid.Health = 20;

	rig.Humanoid.Died.Connect(() => {
		createHealthPack(rig);
		respawnPlayer(Players.GetPlayerFromCharacter(rig));
	});
	const gunTool = ReplicatedStorage.TS.assets.FindFirstChild("Pistol")?.Clone() as Tool;
	gunTool.Parent = Players.GetPlayerFromCharacter(rig)?.WaitForChild("Backpack");

	const gun = fabric.getOrCreateUnitByRef("Gun", gunTool);
	gun.mergeBaseLayer({});
}

ClientRequestDeploy.Connect((player) => {
	assert(player.Character === undefined, "CharacterAutoLoads is disabled, this should not happen");

	player.LoadCharacter();
	if (player.Character) handleCharacterAdded(player.Character);
	player.CharacterAdded.Connect(handleCharacterAdded);
});
