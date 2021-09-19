import FabricLib from "@rbxts/fabric";
import { OnInit, Service } from "@flamework/core";
import { ReplicatedStorage, ServerScriptService, Workspace } from "@rbxts/services";
import Remotes from "shared/Remotes";
import { Config } from "shared/Types";
import { createUnit } from "./createUnit";

const construct_unit = Remotes.Server.Create("constructUnit");

@Service({
	loadOrder: 2,
})
export class UnitConstructor implements OnInit {
	public fabric = new FabricLib.Fabric("Game");

	onInit() {
		const fabric = this.fabric;

		FabricLib.useReplication(fabric);
		FabricLib.useTags(fabric);
		FabricLib.useBatching(fabric);
		fabric.registerUnitsIn(ServerScriptService.TS.units);
		fabric.DEBUG = true;
	}

	createGun(player: Player, settings: Config) {
		const backpack = player.WaitForChild("Backpack");

		const gunTool = ReplicatedStorage.assets.FindFirstChild("Pistol")?.Clone() as Tool;
		gunTool.Parent = backpack;

		return createUnit(this.fabric, "Gun", gunTool, settings, (...args) => {
			print(...args);
			construct_unit.SendToPlayer(player, ...args);
			print("player");
		});
	}

	createHealthPack(player: Player) {
		type HealthPack = Model & {
			PrimaryPart: BasePart;
		};

		const healthPack = ReplicatedStorage.assets.Heal.Clone() as HealthPack;
		healthPack.SetPrimaryPartCFrame(
			healthPack
				.GetPrimaryPartCFrame()
				.sub(healthPack.PrimaryPart.Position)
				.add((player.Character?.FindFirstChild("HumanoidRootPart") as BasePart).Position),
		);
		healthPack.Parent = Workspace;

		return createUnit(this.fabric, "Heal", healthPack, {}, (...args) => {
			construct_unit.SendToAllPlayersExcept(player, ...args);
		});
	}

	createHero(player: Player) {
		return createUnit(this.fabric, "Wyvern", player, {}, (...args) => {
			construct_unit.SendToPlayer(player, ...args);
		});
	}

	createMelee(player: Player) {
		const melee = ReplicatedStorage.assets.FindFirstChild("Knife") as Tool;
		const backpack = player.WaitForChild("Backpack");
		melee.Parent = backpack;

		return createUnit(this.fabric, "Melee", melee, {}, (...args) => {
			construct_unit.SendToPlayer(player, ...args);
		});
	}

	createTag(player: Player) {
		const dogTag = ReplicatedStorage.assets.FindFirstChild("Tag")?.Clone() as Model;
		dogTag.SetPrimaryPartCFrame(
			dogTag
				.GetPrimaryPartCFrame()
				.sub(dogTag.PrimaryPart!.Position)
				.add((player.Character!.FindFirstChild("Humanoid") as BasePart).Position),
		);
		dogTag.Parent = Workspace;

		return createUnit(this.fabric, "Tag", dogTag, {}, (...args) => {
			construct_unit.SendToAllPlayersExcept(player, ...args);
		});
	}
}
