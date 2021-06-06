import FabricLib from "@rbxts/fabric";
import { StarterPlayer, Players, StarterGui } from "@rbxts/services";
import Remotes from "shared/remotes";
import { createHero } from "client/core/factory/createClass";
import { createGun } from "client/core/factory/createGun";
import { createHealthPack } from "client/core/factory/createHealthPack";
import yieldForR15CharacterDescendants from "@rbxts/yield-for-character";

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

ServerCreateHealthPack.Connect((healthPack) => {
	createHealthPack(fabric, healthPack);
});

ServerCreateGun.Connect((pistol, settings) => {
	createGun(fabric, pistol, settings);
});

ServerCreateHero.Connect(() => {
	createHero(fabric, player);
});

async function handleCharacterAdded(character: Model) {
	const rig = await yieldForR15CharacterDescendants(character);
	rig.HumanoidRootPart.Size = new Vector3(5, 6, 4);
}

const onPlayerAdded = (newPlayer: Player) => {
	if (newPlayer === player) return;

	if (newPlayer.Character) handleCharacterAdded(newPlayer.Character);
	handleCharacterAdded(newPlayer.CharacterAdded.Wait()[0]);
};

for (const player of Players.GetPlayers()) onPlayerAdded(player);

Players.PlayerAdded.Connect(() => onPlayerAdded);
