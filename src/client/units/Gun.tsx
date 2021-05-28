import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import Roact from "@rbxts/roact";
import { Players, ReplicatedStorage, SoundService, UserInputService, Workspace } from "@rbxts/services";
import { Crosshair } from "client/UserInterface/App/Crosshair";
import HitMark from "client/UserInterface/App/HitMark";

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

	defaults: {
		debounce: boolean;
		mouseDown: boolean;
		equipped: boolean;
		target: BasePart;
		hit: string;
		player: Player;
	};

	onClientShoot?: (this: ThisFabricUnit<"Gun">, _player: Player, target: Model) => void;
}

const player = Players.LocalPlayer;
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
		hit: undefined!,
		player: undefined!,
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
			UserInputService.MouseIconEnabled = true;
			Roact.unmount(handle);
		};

		const tool = this.ref as Tool;

		tool.Equipped.Connect(onEquipped);
		tool.Unequipped.Connect(onUnequipped);

		tool.Activated.Connect(() => {
			if ((this.get("debounce") as boolean) === true) {
				const rayCastParameters = new RaycastParams();
				rayCastParameters.FilterDescendantsInstances = [player.Character!];
				rayCastParameters.FilterType = Enum.RaycastFilterType.Blacklist;

				const origin = Workspace.CurrentCamera!.CFrame.Position;
				const result = Workspace.Raycast(
					origin,
					mouse.Hit.Position.sub(origin).Unit.mul(100),
					rayCastParameters,
				);

				const target = result?.Instance;

				this.getUnit("Transmitter")!.sendWithPredictiveLayer(
					{
						target,
					},
					"shoot",
					target,
				);
			}
		});
	},

	effects: [
		function (this) {
			if (
				this.get("target") !== undefined &&
				(this.get("target") as Instance).Parent?.FindFirstChild("Humanoid") !== undefined &&
				this.get("debounce") === false
			) {
				const handle = Roact.mount(<HitMark hit={this.get("hit") as string} />, this.get("target") as Instance);

				Promise.delay(0.75).then(() => {
					Roact.unmount(handle);
				});
			}
		},

		function (this) {
			if (this.get("debounce") === false) {
				const pistolShot = ReplicatedStorage.TS.assets.PistolShot.Clone();

				pistolShot.Parent = SoundService;
				pistolShot.Play();
				pistolShot.Ended.Connect(() => pistolShot.Destroy());
			}
		},
	],
};

export = gun;
