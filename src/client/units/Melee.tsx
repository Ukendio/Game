import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Janitor } from "@rbxts/janitor";
import Roact from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import HitMark from "client/ui/app/HitMark";

interface MeleeDefinition extends UnitDefinition<"Melee"> {
	ref?: Tool;

	units: {
		Replicated: {};
		Luck?: {};
	};

	defaults: {
		debounce: boolean;
		target: BasePart | undefined;
		hit: string;
		origin: Vector3 | undefined;
		direction: Vector3 | undefined;
		player: Player | undefined;
	};
	onClientSlash?: (
		this: ThisFabricUnit<"Melee">,
		_player: Player,
		data: {
			target: BasePart | undefined;
			hit: string;
		},
	) => void;

	janitor?: Janitor;
}

declare global {
	interface FabricUnits {
		Melee: MeleeDefinition;
	}
}

const player = Players.LocalPlayer;
const mouse = player.GetMouse();

const melee: MeleeDefinition = {
	name: "Melee",

	units: {
		Replicated: {},
		Luck: {},
	},

	defaults: {
		debounce: true,
		target: undefined,
		hit: "Miss",
		origin: undefined,
		direction: undefined,
		player: undefined,
	},

	janitor: new Janitor(),

	onLoaded: function (this) {
		const tool = this.ref;

		const raycast = (): void => {
			const rayCastParameters = new RaycastParams();
			rayCastParameters.FilterDescendantsInstances = [player.Character!, tool];
			rayCastParameters.FilterType = Enum.RaycastFilterType.Blacklist;

			const origin = Workspace.CurrentCamera!.CFrame;
			const direction = mouse.Hit.Position.sub(origin.Position).Unit.mul(5);
			const result = Workspace.Raycast(origin.Position, direction, rayCastParameters);

			const target = result?.Instance;
			const luck = this.getUnit("Luck");
			const hit = luck?.applyLuck(math.random(10, 75));

			this.getUnit("Transmitter")!.sendWithPredictiveLayer(
				{
					origin: origin.Position,
					direction: direction,
				},
				"slash",
				{ target: target, hit: hit },
			);
		};

		let debounce = true;
		this.janitor?.Add(
			tool.Activated.Connect(() => {
				if (debounce) {
					debounce = false;

					raycast();

					task.delay(0.75, () => (debounce = true));
				}
			}),
		);
	},

	onDestroy: function (this) {
		this.janitor?.Destroy();
	},

	effects: [
		function (this): void {
			const target = this.get("target");

			if (target !== undefined && target.Parent?.FindFirstChild("Humanoid") !== undefined) {
				const handle = Roact.mount(<HitMark hit={this.get("hit")} />, this.get("target") as Instance);

				task.delay(0.75, () => Roact.unmount(handle));
			}
		},
	],
};

export = melee;
