import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import yieldForR15CharacterDescendants from "@rbxts/yield-for-character";

import { getWeaponSettings } from "server/core/helpers/getWeaponSettings";
import { UnitConstructor } from "../unitConstructor";

@Service({
	loadOrder: 7,
})
export class CharacterHandler implements OnStart {
	constructor(private UnitConstructor: UnitConstructor) {}

	onStart() {
		const handleCharacterAdded = (character: Model) => {
			const player = Players.GetPlayerFromCharacter(character)!;
			yieldForR15CharacterDescendants(character).then(({ Humanoid }) => {
				this.UnitConstructor.createGun(player, getWeaponSettings("M16").expect("Unknown weapon name"));

				Humanoid.Health = 20;
				Humanoid.Died.Connect(() => {
					this.UnitConstructor.createHealthPack(player);
					this.UnitConstructor.createTag(player);
				});
			});
		};

		const onPlayerAdded = (player: Player) => {
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
