import { OnStart, Service } from "@rbxts/flamework";
import { Players } from "@rbxts/services";
import yieldForR15CharacterDescendants from "@rbxts/yield-for-character";

import store from "shared/rodux/store";
import { Config, Mode } from "shared/Types";
import { UnitConstructor } from "../unitConstructor";
import { findSpawn } from "./findSpawn";

@Service({
	loadOrder: 3,
})
export class CharacterHandler implements OnStart {
	private stateContainer = store;

	constructor(private UnitConstructor: UnitConstructor) {}

	onStart() {
		const handleCharacterAdded = async (character: Model) => {
			const rig = await yieldForR15CharacterDescendants(character);
			const player = Players.GetPlayerFromCharacter(rig)!;

			this.UnitConstructor.createGun(
				player,
				identity<Config>({
					fireRate: 1,
					recoil: 1,
					maxDistance: 400,
					damage: 5,
					mode: Mode.Auto,
				}),
			);

			rig.Humanoid.Health = 20;
			rig.Humanoid.Died.Connect(() => {
				this.UnitConstructor.createHealthPack(player);
				this.UnitConstructor.createTag(player);
			});

			return rig;
		};

		const onPlayerAdded = (player: Player) => {
			findSpawn(this.stateContainer.getState(), player).then(() => {
				if (player.Character) handleCharacterAdded(player.Character);
				else player.CharacterAdded.Connect(handleCharacterAdded);
			});
		};

		Players.PlayerAdded.Connect(onPlayerAdded);
		for (const player of Players.GetPlayers()) {
			onPlayerAdded(player);
		}
	}
}
