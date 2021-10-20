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

	public onInit(): void {
		const fabric = this.fabric;

		FabricLib.useReplication(fabric);
		FabricLib.useTags(fabric);
		FabricLib.useBatching(fabric);
		fabric.registerUnitsIn(ServerScriptService.TS.units);
		fabric.DEBUG = true;
	}

	public createGun(player: Player, settings: Config): void {
		const backpack = player.WaitForChild("Backpack");

		const gunTool = ReplicatedStorage.assets.FindFirstChild("Pistol")?.Clone() as Tool;
		gunTool.Parent = backpack;

		createUnit(this.fabric, "Gun", gunTool, settings, (...args) => {
			construct_unit.SendToPlayer(player, ...args);
		});
	}

	public createHealthPack(player: Player): void {
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

		createUnit(this.fabric, "Heal", healthPack, {}, (...args) => {
			construct_unit.SendToAllPlayersExcept(player, ...args);
		});
	}

	public createHero(player: Player): void {
		createUnit(this.fabric, "Wyvern", player, {}, (...args) => {
			construct_unit.SendToPlayer(player, ...args);
		});
	}

	public createMelee(player: Player): void {
		const melee = ReplicatedStorage.assets.FindFirstChild("Knife") as Tool;
		const backpack = player.WaitForChild("Backpack");
		melee.Parent = backpack;

		createUnit(this.fabric, "Melee", melee, {}, (...args) => {
			construct_unit.SendToPlayer(player, ...args);
		});
	}

	public createTag(player: Player): void {
		const dogTag = ReplicatedStorage.assets.FindFirstChild("Tag")?.Clone() as Model;
		dogTag.SetPrimaryPartCFrame(
			dogTag
				.GetPrimaryPartCFrame()
				.sub(dogTag.PrimaryPart!.Position)
				.add((player.Character!.FindFirstChild("Humanoid") as BasePart).Position),
		);
		dogTag.Parent = Workspace;

		createUnit(this.fabric, "Tag", dogTag, {}, (...args) => {
			construct_unit.SendToAllPlayersExcept(player, ...args);
		});
	}
}
