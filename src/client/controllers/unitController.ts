import FabricLib from "@rbxts/fabric";
import { Controller, OnInit } from "@rbxts/flamework";
import { StarterPlayer } from "@rbxts/services";
import remotes from "shared/Remotes";

const clientEvents = remotes.Client;
const constructUnit = clientEvents.WaitFor("constructUnit");

@Controller({})
export class UnitController implements OnInit {
	onInit() {
		const fabric = new FabricLib.Fabric("Game");

		fabric.DEBUG = true;
		FabricLib.useReplication(fabric);
		FabricLib.useTags(fabric);
		FabricLib.useBatching(fabric);
		fabric.registerUnitsIn(StarterPlayer.StarterPlayerScripts.TS.units);

		constructUnit.then((remote) => {
			remote.Connect((unitResolvable, ref, layerData) => {
				const c = fabric.getOrCreateUnitByRef(unitResolvable, ref);
				c.mergeBaseLayer(layerData);
			});
		});
	}
}


