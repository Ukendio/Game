import { OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Result } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import yieldForR15CharacterDescendants from "@rbxts/yield-for-character";

import store from "server/core/rodux/store";
import { getWeaponSettings } from "server/core/helpers/getWeaponSettings";
import { UnitConstructor } from "../unitConstructor";
import { findSpawn } from "./findSpawn";

@Service({
	loadOrder: 3,
})
export class CharacterHandler implements OnStart {
	constructor(private UnitConstructor: UnitConstructor) {}

	onStart() {
		const handleCharacterAdded = async (character: Model) => {
			const rig = await yieldForR15CharacterDescendants(character);
			const player = Players.GetPlayerFromCharacter(rig)!;

			this.UnitConstructor.createGun(player, getWeaponSettings("AK47").expect("Unknown weapon name"));

			rig.Humanoid.Health = 20;
			rig.Humanoid.Died.Connect(() => {
				this.UnitConstructor.createHealthPack(player);
				this.UnitConstructor.createTag(player);
			});

			return rig;
		};

		const onPlayerAdded = (player: Player) => {
			player.RespawnLocation = findSpawn(store).expect("Couldn't find a spawn location");

			player.Character
				? handleCharacterAdded(player.Character)
				: player.CharacterAdded.Connect(handleCharacterAdded);
		};

		Players.PlayerAdded.Connect(onPlayerAdded);
		for (const player of Players.GetPlayers()) {
			onPlayerAdded(player);
		}
	}
}
