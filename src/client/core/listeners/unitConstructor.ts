import FabricLib from "@rbxts/fabric";
import { StarterPlayer, Players } from "@rbxts/services";
import Remotes from "shared/remotes";

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
const ServerCreateHero = Remotes.Client.Get("ServerCreateHero");
const ServerCreateMelee = Remotes.Client.Get("ServerCreateMelee");
const ServerCreateTag = Remotes.Client.Get("ServerCreateTag");

ServerCreateHealthPack.Connect((healthPack) => {
	const c = fabric.getOrCreateUnitByRef("Heal", healthPack);
	c.mergeBaseLayer({});
});

ServerCreateGun.Connect((pistol, settings) => {
	const c = fabric.getOrCreateUnitByRef("Gun", pistol);
	c.mergeBaseLayer({ configurableSettings: settings });
});

ServerCreateHero.Connect(() => {
	const c = fabric.getOrCreateUnitByRef("Wyvern", player);
	c.mergeBaseLayer({});
});

ServerCreateMelee.Connect((melee) => {
	const c = fabric.getOrCreateUnitByRef("Melee", melee);
	c.mergeBaseLayer({});
});

ServerCreateTag.Connect((tag) => {
	const c = fabric.getOrCreateUnitByRef("Tag", tag);
	c.mergeBaseLayer({});
});
