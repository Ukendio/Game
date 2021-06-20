import FabricLib from "@rbxts/fabric";
import { Controller, OnInit, OnStart } from "@rbxts/flamework";
import { StarterPlayer } from "@rbxts/services";
import { Events } from "shared/remotes";

const events = Events.client;

@Controller({})
export class UnitController implements OnInit {
	onInit() {
		const fabric = new FabricLib.Fabric("Game");

		fabric.DEBUG = true;
		FabricLib.useReplication(fabric);
		FabricLib.useTags(fabric);
		FabricLib.useBatching(fabric);
		fabric.registerUnitsIn(StarterPlayer.StarterPlayerScripts.TS.units);

		events.connect("unitConstructHealthPack", (healthPack) => {
			const c = fabric.getOrCreateUnitByRef("Heal", healthPack);
			c.mergeBaseLayer({});
		});

		events.connect("unitConstructGun", (tool, config) => {
			const c = fabric.getOrCreateUnitByRef("Gun", tool);
			c.mergeBaseLayer({ configurableSettings: config });
		});

		events.connect("unitConstructHero", (player) => {
			const c = fabric.getOrCreateUnitByRef("Wyvern", player);
			c.mergeBaseLayer({});
		});

		events.connect("unitConstructMelee", (melee) => {
			const c = fabric.getOrCreateUnitByRef("Melee", melee);
			c.mergeBaseLayer({});
		});
		events.connect("unitConstructTag", (tag) => {
			const c = fabric.getOrCreateUnitByRef("Tag", tag);
			c.mergeBaseLayer({});
		});
	}
}
