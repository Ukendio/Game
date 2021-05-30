import { Fabric } from "@rbxts/fabric";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import Remotes from "shared/remotes";

const ServerCreateHealthPack = Remotes.Server.Create("ServerCreateHealthPack");

export function createHealthPack(fabric: Fabric, player: Player) {
	const healthPack = ReplicatedStorage.TS.assets.Heal.Clone();
	healthPack.Parent = Workspace;
	healthPack.SetPrimaryPartCFrame(
		healthPack
			.GetPrimaryPartCFrame()
			.sub(healthPack.PrimaryPart!.Position)
			.add((player.Character!.FindFirstChild("HumanoidRootPart") as BasePart).Position),
	);

	const c = fabric.getOrCreateUnitByRef("Heal", healthPack);
	c.mergeBaseLayer({});

	ServerCreateHealthPack.SendToAllPlayersExcept(player, healthPack);
}
