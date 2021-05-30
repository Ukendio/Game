import { Fabric } from "@rbxts/fabric";
import { ReplicatedStorage } from "@rbxts/services";
import Remotes from "shared/remotes";

const ServerCreateGun = Remotes.Server.Create("ServerCreateGun");

//TODO: common gun handler to make function generic, currently only able to create one type of gun

export function createGun(fabric: Fabric, player: Player) {
	const backpack = player.WaitForChild("Backpack");

	const gunTool = ReplicatedStorage.TS.assets.FindFirstChild("Pistol")?.Clone() as Tool;
	gunTool.Parent = backpack;

	const gun = fabric.getOrCreateUnitByRef("Gun", gunTool);
	gun.mergeBaseLayer({});

	ServerCreateGun.SendToPlayer(player, gunTool);
	print("hell yeah");
}
