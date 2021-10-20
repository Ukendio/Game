import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Janitor } from "@rbxts/janitor";

interface TagDefinition extends UnitDefinition<"Tag"> {
	name: "Tag";

	ref?: Model;

	units: {
		Replicated: {};
	};

	defaults?: {
		debounce: true;
		target: Humanoid | undefined;
		transparency: number;
		particleEnabled: boolean;
		owner: Player | undefined;
		finder: Player | undefined;
	};

	janitor: Janitor;

	onClientTag?: (this: ThisFabricUnit<"Tag">, _player: Player, packet: { transparency: number }) => void;
}

declare global {
	interface FabricUnits {
		Tag: TagDefinition;
	}
}

export = identity<TagDefinition>({
	name: "Tag",

	units: { Replicated: {} },

	janitor: new Janitor(),

	onInitialize: function (this) {
		const model = this.ref;
		const part = model.PrimaryPart!;

		this.janitor.Add(
			part.Touched.Connect((hit) => {
				if (hit.Parent?.FindFirstChild("Humanoid")) {
					this.getUnit("Transmitter")!.sendWithPredictiveLayer(
						{
							transparency: 1,
						},
						"tag",
					);
				}
			}),
		);
	},

	onDestroy: function (this) {
		this.janitor.Destroy();
	},
});
