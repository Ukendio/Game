import { OnStart, Service } from "@flamework/core";
import promiseR15 from "@rbxts/promise-character";
import { Players } from "@rbxts/services";

import { getWeaponSettings } from "server/core/helpers/getWeaponSettings";
import { UnitConstructor } from "../unitConstructor";

@Service({
	loadOrder: 7,
})
export class CharacterHandler implements OnStart {
	public constructor(private UnitConstructor: UnitConstructor) {}

	public onStart(): void {
		const handleCharacterAdded = (character: Model): void => {
			const player = Players.GetPlayerFromCharacter(character)!;
			promiseR15(character)
				.then(({ Humanoid }) => {
					this.UnitConstructor.createGun(player, getWeaponSettings("M16").expect("Unknown weapon name"));

					Humanoid.Health = 20;
					Humanoid.Died.Connect(() => {
						this.UnitConstructor.createHealthPack(player);
						this.UnitConstructor.createTag(player);
					});
				})
				.await();
		};

		const onPlayerAdded = (player: Player): void => {
			if (player.Character) handleCharacterAdded(player.Character);
			else player.CharacterAdded.Connect(handleCharacterAdded);
		};

		Players.PlayerAdded.Connect(onPlayerAdded);
		for (const player of Players.GetPlayers()) {
			onPlayerAdded(player);
		}
	}
}
