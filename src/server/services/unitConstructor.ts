import FabricLib from "@rbxts/fabric";
import { OnInit, Service } from "@rbxts/flamework";
import { ServerScriptService } from "@rbxts/services";

@Service({
	loadOrder: 1,
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
}
