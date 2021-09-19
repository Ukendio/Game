import FabricLib from "@rbxts/fabric";
import { StarterPlayer } from "@rbxts/services";
import remotes from "shared/Remotes";
import { Controller, OnInit } from "@flamework/core";

const clientEvents = remotes.Client;
const construct_unit = clientEvents.WaitFor("constructUnit");

@Controller({})
export class UnitConstructor implements OnInit {
	onInit() {
		const fabric = new FabricLib.Fabric("Game");

		fabric.DEBUG = true;
		FabricLib.useReplication(fabric);
		FabricLib.useTags(fabric);
		FabricLib.useBatching(fabric);
		fabric.registerUnitsIn(StarterPlayer.StarterPlayerScripts.TS.units);

		construct_unit.then((r) => {
			r.Connect((unitResolvable, ref, layerData) => {
				print(ref);
				const c = fabric.getOrCreateUnitByRef(unitResolvable, ref);
				c.mergeBaseLayer(layerData);
				print(c);
			});
		});
	}
}
