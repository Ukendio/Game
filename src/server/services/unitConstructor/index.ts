import FabricLib from "@rbxts/fabric";
import { OnInit, Service } from "@rbxts/flamework";
import { ReplicatedStorage, ServerScriptService, Workspace } from "@rbxts/services";
import remotes from "shared/Remotes";
import { Config } from "shared/Types";
import { createUnit } from "./createUnit";

const serverEvents = remotes.Server;

@Service({
	loadOrder: 3,
})
export class UnitConstructor implements OnInit {
	public fabric = new FabricLib.Fabric("Game");

	private constructUnit = serverEvents.Create("constructUnit");

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

		return createUnit(this.fabric, "Gun", gunTool, { configurableSettings: settings }, (...args) => {
			this.constructUnit.SendToPlayer(player, ...args);
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
			this.constructUnit.SendToAllPlayersExcept(player, ...args);
		});
	}

	createHero(player: Player) {
		return createUnit(this.fabric, "Wyvern", player, {}, (...args) => {
			this.constructUnit.SendToPlayer(player, ...args);
		});
	}

	createMelee(player: Player) {
		const melee = ReplicatedStorage.assets.FindFirstChild("Knife") as Tool;
		const backpack = player.WaitForChild("Backpack");
		melee.Parent = backpack;

		return createUnit(this.fabric, "Melee", melee, {}, (...args) => {
			this.constructUnit.SendToPlayer(player, ...args);
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
			this.constructUnit.SendToAllPlayersExcept(player, ...args);
		});
	}
}
