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

			getWeaponSettings("AK47")
				.map((config) => this.UnitConstructor.createGun(player, config.expect("Unknown weapon name")))
				.mapErr((errorMessage) => Log.Error(errorMessage));

			rig.Humanoid.Health = 20;
			rig.Humanoid.Died.Connect(() => {
				this.UnitConstructor.createHealthPack(player);
				this.UnitConstructor.createTag(player);
			});

			return rig;
		};

		const onPlayerAdded = (player: Player) => {
			findSpawn(store)
				.map((closestSpawnOption) => {
					closestSpawnOption.match(
						(closestSpawn) => {
							player.RespawnLocation = closestSpawn;
							return Result.ok("Changed Player respawn location");
						},
						() => Result.err("No spawn location found"),
					);
				})
				.mapErr((errorMessage) => Log.Error(errorMessage));

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
