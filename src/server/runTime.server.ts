import { ServerScriptService, Workspace, Players, ReplicatedStorage, PhysicsService } from "@rbxts/services";
import { CharacterRigR15, yieldForR15CharacterDescendants } from "@rbxts/yield-for-character";
import FabricLib, { Fabric } from "@rbxts/fabric";
import Remotes from "shared/Remotes";
import { t } from "@rbxts/t";

const ServerCreateHealthPack = Remotes.Server.Create("ServerCreateHealthPack");
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
		fabric.removeAllUnitsWithRef("Heal");
		healthPack.Destroy();
	});
}

async function handleCharacterAdded(character: Model) {
	const rig = await yieldForR15CharacterDescendants(character);
	rig.Humanoid.Health = 20;

	rig.Humanoid.Died.Connect(() => {
		createHealthPack(rig);
	});
	const gunTool = new Instance("Tool");
	gunTool.Name = "GunTool";
	gunTool.Parent = Players.GetPlayerFromCharacter(rig)?.WaitForChild("Backpack");
	const handle = new Instance("Part");
	handle.Parent = gunTool;
	handle.Name = "Handle";

	const gun = fabric.getOrCreateUnitByRef("Gun", gunTool);
	gun.mergeBaseLayer({});
}

const onPlayerAdded = (player: Player) => {
	if (player.Character) handleCharacterAdded(player.Character);
	else player.CharacterAdded.Connect(handleCharacterAdded);
};

for (const player of Players.GetPlayers()) {
	onPlayerAdded(player);
}

Players.PlayerAdded.Connect(onPlayerAdded);
