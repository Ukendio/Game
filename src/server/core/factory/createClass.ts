import { Fabric } from "@rbxts/fabric";
import Remotes from "shared/remotes";

const ServerCreateHero = Remotes.Server.Create("ServerCreateHero");

export function createHero(fabric: Fabric, player: Player) {
	const wyvernAbilities = fabric.getOrCreateUnitByRef("Wyvern", player);
	wyvernAbilities.mergeBaseLayer({});

	ServerCreateHero.SendToPlayer(player, player);
}
