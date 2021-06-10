import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Janitor } from "@rbxts/janitor";
import Roact from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import HitMark from "client/UserInterface/App/HitMark";

interface MeleeDefinition extends UnitDefinition<"Melee"> {
	ref?: Tool;

	units: {
		Replicated: [];
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
		Replicated: [],
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

	onInitialize: function (this) {
		this.fabric.getOrCreateUnitByRef("Luck", this);
		const tool = this.ref;

		const raycast = () => {
			print("slash");
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

					Promise.delay(5).then(() => {
						debounce = true;
					});
				}
			}),
		);
	},

	onDestroy: function (this) {
		this.janitor?.Destroy();
	},

	effects: [
		function (this) {
			const target = this.get("target");

			if (target !== undefined && target.Parent?.FindFirstChild("Humanoid") !== undefined) {
				const handle = Roact.mount(<HitMark hit={this.get("hit")} />, this.get("target") as Instance);

				Promise.delay(0.75).then(() => {
					Roact.unmount(handle);
				});
			}
		},
	],
};

export = melee;
