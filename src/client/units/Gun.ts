import FabricLib, { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Players } from "@rbxts/services";

const player = Players.LocalPlayer;
const mouse = player.GetMouse();

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
	};

	onClientShoot?: (this: ThisFabricUnit<"Gun">, _player: Player, damage: number) => void;
}

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
	},

	onInitialize: function (this) {
		function updateMouseIcon(mouse?: Mouse) {
			if (mouse !== undefined) mouse.Icon = "rbxasset://textures/GunCursor.png";
		}

		const onEquipped = (mouse: Mouse) => {
			updateMouseIcon(mouse);
		};

		const onUnequipped = () => {
			updateMouseIcon();
		};

		const tool = this.ref as Tool;

		tool.Equipped.Connect(onEquipped);
		tool.Unequipped.Connect(onUnequipped);

		tool.Activated.Connect(() => {
			if ((this.get("debounce") as boolean) === true) {
				const amount = math.random(10, 50);
				this.getUnit("Transmitter")!.sendWithPredictiveLayer(
					{
						damage: amount,
					},
					"shoot",
					amount,
				);
			}
		});
	},

	effects: [
		function (this) {
			const tool = this.ref as Tool;
			const handle = tool.FindFirstChild("Handle")! as BasePart;
			handle.Size = new Vector3(handle.Size.X, this.get("damage") as number, handle.Size.Z);
		},
	],
};

export = gun;
