import { UnitDefinition } from "@rbxts/fabric";
import { match } from "@rbxts/rbxts-pattern";
import { Option } from "@rbxts/rust-classes";
import { Players, RunService, UserInputService, Workspace } from "@rbxts/services";
import { interval } from "@rbxts/yessir";
import { Config, Mode } from "shared/Types";
import { create_view_model } from "client/core/create_view_model";

const camera = Workspace.CurrentCamera;
const player = Players.LocalPlayer;
const mouse = player.GetMouse();

interface Gun extends UnitDefinition<"Gun"> {
	ref?: Tool & {
		Handle: BasePart & {
			LeftArmAttach: Attachment;
			RightArmAttach: Attachment;
		};
	};

	units: {
		Cam?: {
			recoil_speed: number;
			recoil_height: number;
			offset: CFrame;
			now: number;

			current_camera_cframe: CFrame;
			camera_type: Enum.CameraType;
			right_handed: boolean;

			view_model: Instance;
			last_shot: Option<number>;
			recoil_collected: number;
		};
		HitScan: {};
	};

	defaults?: Config;
}

declare global {
	interface FabricUnits {
		Gun: Gun;
	}
}

export = identity<Gun>({
	name: "Gun",

	units: {
		Cam: {
			recoil_speed: 9,
			recoil_height: 0.7,
			offset: new CFrame(),
			now: os.clock(),

			current_camera_cframe: new CFrame(),
			camera_type: Enum.CameraType.Custom,
			right_handed: true,

			view_model: new Instance("Part"),
			last_shot: Option.none(),
			recoil_collected: 0,
		},
		HitScan: {},
	},

	onLoaded: function (this) {
		const cam_unit = this.getUnit("Cam")!;
		cam_unit.addLayer("recoil", { recoil_height: this.get("recoil") });

		if (!this.ref) return;

		const equipped = false;

		UserInputService.InputBegan.Connect(({ UserInputType }) => {
			if (UserInputType !== Enum.UserInputType.MouseButton1 && !equipped) return;

			const character = player.Character;
			if (character) {
				const ray_cast = (active_recoil?: number) => {
					this.getUnit("HitScan")?.hit?.([character], camera!.CFrame, mouse.Hit.Position, {
						...this.data!,
						recoil: active_recoil ?? this.defaults!.recoil,
					});
				};

				cam_unit.addLayer("shot", { last_shot: Option.some<number>(os.clock()) });

				match(this.get("mode"))
					.with(Mode.Auto, () => {
						const { event, callback } = interval(1 / this.get("fire_rate"), ray_cast);

						const connection = event.connect(() => callback(os.clock()));

						UserInputService.InputEnded.Connect(({ UserInputType }) => {
							return UserInputType === Enum.UserInputType.MouseButton1
								? connection.disconnect()
								: undefined;
						});
					})
					.with(Mode.Burst, () => {})
					.with(Mode.Semi, () => ray_cast())
					.exhaustive();
			}
		});

		cam_unit.change_view_model(create_view_model(this));
	},

	effects: [
		function (this) {
			const humanoid = player.Character?.FindFirstChildOfClass("Humanoid");

			if (humanoid) {
				humanoid.WalkSpeed -= this.get("weight");
			}
		},
	],
});
