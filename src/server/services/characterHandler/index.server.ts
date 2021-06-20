import { OnStart, Service } from "@rbxts/flamework";
import { Option } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import yieldForR15CharacterDescendants from "@rbxts/yield-for-character";

import store from "server/core/store";
import { createHealthPack } from "server/core/unitFactory/createHealthPack";
import { createTag } from "server/core/unitFactory/createTag";
import { UnitConstructor } from "../unitConstructor";
import { findSpawn } from "./findSpawn";

@Service({
	loadOrder: 2,
})
export class CharacterHandler implements OnStart {
	private stateContainer = store;

	constructor(private UnitConstructor: UnitConstructor) {}

	onStart() {
		const handleCharacterAdded = async (character: Model) => {
			const rig = await yieldForR15CharacterDescendants(character);
			const player = Players.GetPlayerFromCharacter(rig);

			rig.Humanoid.Health = 20;
			rig.Humanoid.Died.Connect(() => {
				createHealthPack(this.UnitConstructor.fabric, Option.wrap(player)).mapErr((err) => warn(err));
				createTag(this.UnitConstructor.fabric, player!);
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
