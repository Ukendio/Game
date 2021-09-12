import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import Unit from "@rbxts/fabric/src/FabricLib/Fabric/Unit";
import { Workspace } from "@rbxts/services";
import Yessir from "@rbxts/yessir";
import { Config } from "shared/Types";

interface TransmitData {
	target?: BasePart;
}

interface HitScan extends UnitDefinition<"HitScan"> {
	ref?: Unit<"Gun">;

	units: {
		Replicated: object;
	};

	defaults: {
		origin?: Vector3;
		target?: BasePart;

		player?: Player;
	};

	hit?: (this: ThisFabricUnit<"HitScan">, ...parameters: Parameters<typeof ray_cast>) => void;

	on_active_event?: Yessir;

	onClientHit?: (this: ThisFabricUnit<"HitScan">, player: Player, transmit_data: TransmitData) => void;
}

declare global {
	interface FabricUnits {
		HitScan: HitScan;
	}
}

function ray_cast(
	filter_list: Array<Instance>,
	origin_in_cframe: CFrame,
	end_position: Vector3,
	configurable_settings: Config,
) {
	const ray_cast_parameters = new RaycastParams();
	ray_cast_parameters.FilterDescendantsInstances = filter_list;
	ray_cast_parameters.FilterType = Enum.RaycastFilterType.Blacklist;

	const direction = end_position.sub(origin_in_cframe.Position).Unit.mul(configurable_settings.max_distance);
	const ray_cast_result = Workspace.Raycast(origin_in_cframe.Position, direction, ray_cast_parameters);

	return function (ray_cast_builder: (cf: CFrame, instance?: Instance) => void) {
		return ray_cast_builder(origin_in_cframe, ray_cast_result?.Instance);
	};
}

export = identity<HitScan>({
	name: "HitScan",

	units: {
		Replicated: {},
	},

	defaults: {},

	on_active_event: new Yessir(),

	hit: function (this, ...parameters: Parameters<typeof ray_cast>) {
		ray_cast(...parameters)((origin, target) => {
			this.getUnit("Transmitter")?.sendWithPredictiveLayer({ origin, target }, "hit", {
				target,
			});
		});
	},

	effects: [
		function (this) {
			if (this.get("origin") && this.get("target")) {
				this.on_active_event?.fireUnsafe();
			}
		},
	],
});
