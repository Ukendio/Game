import { Fabric } from "@rbxts/fabric";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import Remotes from "shared/remotes";

const ServerCreateTag = Remotes.Server.Create("ServerCreateTag");

export function createTag(fabric: Fabric, player: Player) {
	const dogTag = ReplicatedStorage.assets.FindFirstChild("Tag")?.Clone() as Model;
	dogTag.SetPrimaryPartCFrame(
		dogTag
			.GetPrimaryPartCFrame()
			.sub(dogTag.PrimaryPart!.Position)
			.add((player.Character!.FindFirstChild("Humanoid") as BasePart).Position),
	);
	dogTag.Parent = Workspace;

	const tag = fabric.getOrCreateUnitByRef("Tag", dogTag);
	tag.mergeBaseLayer({ owner: player });

	ServerCreateTag.SendToAllPlayersExcept(player, dogTag);
}
