import FabricLib from "@rbxts/fabric";
import { StarterPlayer } from "@rbxts/services";
import remotes from "shared/Remotes";
import { Controller, OnInit } from "@flamework/core";

const clientEvents = remotes.Client;
const construct_unit = clientEvents.WaitFor("constructUnit");

@Controller({
	loadOrder: 2,
})
export class UnitConstructor implements OnInit {
	public onInit(): void {
		const fabric = new FabricLib.Fabric("Game");

		fabric.DEBUG = true;
		FabricLib.useReplication(fabric);
		FabricLib.useTags(fabric);
		FabricLib.useBatching(fabric);
		fabric.registerUnitsIn(StarterPlayer.StarterPlayerScripts.TS.units);

		construct_unit
			.then<void>((r) => {
				r.Connect((unit_resolvable, ref, defaults) => {
					const c = fabric.getOrCreateUnitByRef(unit_resolvable, ref);
					c.defaults = defaults;
					c.mergeBaseLayer(defaults);
				});
			})
			.await();
	}
}
