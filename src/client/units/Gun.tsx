import FabricLib, { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import Roact from "@rbxts/roact";
import { Players, ReplicatedStorage, UserInputService, Workspace } from "@rbxts/services";
import { CharacterRigR15 } from "@rbxts/yield-for-character";
import { Crosshair } from "client/App/Crosshair";
import HitMark from "client/App/HitMark";

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
		target: Model;
	};

	onClientShoot?: (this: ThisFabricUnit<"Gun">, _player: Player, target: Model) => void;
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
		target: undefined!,
	},

	onInitialize: function (this) {
		let handle: Roact.Tree;
		const pistolShot = ReplicatedStorage.TS.assets.PistolShot.Clone();

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
				const rayCastParameters = new RaycastParams();
				rayCastParameters.FilterDescendantsInstances = [character];
				rayCastParameters.FilterType = Enum.RaycastFilterType.Blacklist;

				const direction = this.get("direction") as Vector3;

				if (direction !== undefined) {
					const result = Workspace.Raycast(this.get("origin") as Vector3, direction, rayCastParameters);
					const target = result?.Instance;

					if (result && target) {
						this.getUnit("Transmitter")!.sendWithPredictiveLayer(
							{
								target,
							},
							"shoot",
							target,
						);
					}
				}

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
