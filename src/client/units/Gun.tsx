import FabricLib, { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import Roact from "@rbxts/roact";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { CharacterRigR15 } from "@rbxts/yield-for-character";
import { Crosshair } from "client/App/Crosshair";
import HitMark from "client/App/Hitmark";

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
		debounce: boolean;
		mouseDown: boolean;
		equipped: boolean;
		origin: Vector3;
		direction: Vector3;
		hit: string;
		target: Model;
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
		debounce: true,
		mouseDown: false,
		equipped: false,
		origin: undefined!,
		direction: undefined!,
		hit: "Miss",
		target: undefined!,
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

				this.addLayer("temporaryRecoil", {
					recoil: 1231,
				});
			}
		});
	},

	effects: [
		function (this) {
			if (
				this.get("target") !== undefined &&
				(this.get("target") as Instance).Parent?.FindFirstChild("Humanoid") !== undefined
			) {
				const handle = Roact.mount(<HitMark hit={this.get("hit") as string} />, this.get("target") as Instance);
				Promise.delay(0.25).then(() => Roact.unmount(handle));
			}
		},

		function (this) {
			print(this.get("recoil"));
		},
	],
};

export = gun;
