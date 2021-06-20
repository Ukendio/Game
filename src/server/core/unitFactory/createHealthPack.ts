import { Fabric } from "@rbxts/fabric";
import { Option, Result } from "@rbxts/rust-classes";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { serverEvents } from "shared/remotes";

type HealthPack = Model & {
	PrimaryPart: BasePart;
};

export function createHealthPack(fabric: Fabric, playerOptional: Option<Player>) {
	return playerOptional.match(
		(player) => {
			const healthPack = ReplicatedStorage.assets.Heal.Clone() as HealthPack;
			healthPack.SetPrimaryPartCFrame(
				healthPack
					.GetPrimaryPartCFrame()
					.sub(healthPack.PrimaryPart.Position)
					.add((player.Character?.FindFirstChild("HumanoidRootPart") as BasePart).Position),
			);
			healthPack.Parent = Workspace;

			const c = fabric.getOrCreateUnitByRef("Heal", healthPack);
			c.mergeBaseLayer({});

			serverEvents.unitConstructHealthPack.fire(player, healthPack);
			return Result.ok("healthPack created");
		},
		() => Result.err("player argument was nil"),
	);
}
