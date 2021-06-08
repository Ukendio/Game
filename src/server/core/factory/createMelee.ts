import { Fabric } from "@rbxts/fabric";
import Remotes from "shared/remotes";

const ServerCreateMelee = Remotes.Server.Create("ServerCreateMelee");

export function createMelee(fabric: Fabric, player: Player, melee: Tool) {
	const backpack = player.WaitForChild("Backpack");

	melee.Parent = backpack;

	const c = fabric.getOrCreateUnitByRef("Melee", melee);
	c.mergeBaseLayer({});

	ServerCreateMelee.SendToPlayer(player, melee);
}
