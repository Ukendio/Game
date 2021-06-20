import FabricLib from "@rbxts/fabric";
import { Controller, OnInit } from "@rbxts/flamework";
import { StarterPlayer } from "@rbxts/services";
import { clientEvents } from "shared/remotes";

@Controller({})
export class UnitController implements OnInit {
	onInit() {
		const fabric = new FabricLib.Fabric("Game");

		fabric.DEBUG = true;
		FabricLib.useReplication(fabric);
		FabricLib.useTags(fabric);
		FabricLib.useBatching(fabric);
		fabric.registerUnitsIn(StarterPlayer.StarterPlayerScripts.TS.units);

		clientEvents.connect("unitConstructHealthPack", (healthPack) => {
			const c = fabric.getOrCreateUnitByRef("Heal", healthPack);
			c.mergeBaseLayer({});
		});

		clientEvents.connect("unitConstructGun", (tool, config) => {
			const c = fabric.getOrCreateUnitByRef("Gun", tool);
			c.mergeBaseLayer({ configurableSettings: config });
		});

		clientEvents.connect("unitConstructHero", (player) => {
			const c = fabric.getOrCreateUnitByRef("Wyvern", player);
			c.mergeBaseLayer({});
		});

		clientEvents.connect("unitConstructMelee", (melee) => {
			const c = fabric.getOrCreateUnitByRef("Melee", melee);
			c.mergeBaseLayer({});
		});
		clientEvents.connect("unitConstructTag", (tag) => {
			const c = fabric.getOrCreateUnitByRef("Tag", tag);
			c.mergeBaseLayer({});
		});
	}
}
