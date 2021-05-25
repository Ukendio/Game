import FabricLib, { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Players, UserInputService } from "@rbxts/services";
import { CharacterRigR15 } from "@rbxts/yield-for-character";

declare global {
	interface FabricUnits {
		Gun: GunDefinition;
	}
}

interface GunDefinition extends UnitDefinition<"Gun"> {
	name: "Gun";
	tag: "Gun";

	units: {
		Replicated: {};
	};

	defaults?: {
		damage: number;
		debounce: boolean;
		mouseDown: boolean;
		equipped: boolean;
		origin: Vector3;
		direction: Vector3;
	};

	onClientShoot?: (
		this: ThisFabricUnit<"Gun">,
		_player: Player,
		data: {
			origin: Vector3;
			direction: Vector3;
		},
	) => void;
}

const player = Players.LocalPlayer;
const character = (player.Character ?? player.CharacterAdded.Wait()[0]) as CharacterRigR15;
const mouse = player.GetMouse();

const gun: GunDefinition = {
	name: "Gun",
	tag: "Gun",

	units: {
		Replicated: {},
	},

	defaults: {
		damage: 0,
		debounce: true,
		mouseDown: false,
		equipped: false,
		origin: undefined!,
		direction: undefined!,
	},

	onInitialize: function (this) {
		const onEquipped = () => {
			UserInputService.MouseIconEnabled = false;
		};

		const onUnequipped = () => {
			mouse.Icon = "";
		};

		const tool = this.ref as Tool;

		tool.Equipped.Connect(onEquipped);
		tool.Unequipped.Connect(onUnequipped);

		tool.Activated.Connect(() => {
			if ((this.get("debounce") as boolean) === true) {
				const data = {
					origin: character.HumanoidRootPart.Position,
					direction: mouse.Hit.Position.sub(character.HumanoidRootPart.Position).Unit.mul(100),
				};
				this.getUnit("Transmitter")!.sendWithPredictiveLayer(data, "shoot", data);
			}
		});
	},

	effects: [],
};

export = gun;
