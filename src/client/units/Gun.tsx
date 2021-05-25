import FabricLib, { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import Roact from "@rbxts/roact";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { CharacterRigR15 } from "@rbxts/yield-for-character";
import { Crosshair } from "client/App/Crosshair";

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
const SETTINGS = {
	fireRate: 1,
	recoil: 1,
};

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
		let handle: Roact.Tree;
		const onEquipped = () => {
			handle = Roact.mount(
				<screengui ZIndexBehavior="Sibling">
					<Crosshair
						mouseOffset={Workspace.CurrentCamera!.ViewportSize.Y / 2 - 36}
						fireRate={SETTINGS.fireRate}
						recoil={SETTINGS.recoil}
					/>
				</screengui>,
				player.WaitForChild("PlayerGui"),
			);

			UserInputService.MouseIconEnabled = false;
		};

		const onUnequipped = () => {
			mouse.Icon = "";
			Roact.unmount(handle);
		};
		player.CameraMode = Enum.CameraMode.LockFirstPerson;
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;

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
