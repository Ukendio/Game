import FabricLib from "@rbxts/fabric";
import { StarterPlayer, Players, StarterGui } from "@rbxts/services";
import Remotes from "shared/remotes";
import { createHero } from "../factory/createClass";
import { createGun } from "../factory/createGun";
import { createHealthPack } from "../factory/createHealthPack";

const player = Players.LocalPlayer;
const fabric = new FabricLib.Fabric("Game");
{
	fabric.DEBUG = true;
	FabricLib.useReplication(fabric);
	FabricLib.useTags(fabric);
	FabricLib.useBatching(fabric);
	fabric.registerUnitsIn(StarterPlayer.StarterPlayerScripts.TS.units);
}

const ServerCreateHealthPack = Remotes.Client.Get("ServerCreateHealthPack");
const ServerCreateGun = Remotes.Client.Get("ServerCreateGun");

createHero(fabric, player);

ServerCreateHealthPack.Connect((healthPack) => {
	createHealthPack(fabric, healthPack);
});

ServerCreateGun.Connect((pistol) => {
	createGun(fabric, pistol);
});
