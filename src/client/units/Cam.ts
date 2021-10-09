import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Option } from "@rbxts/rust-classes";
import { Players, Workspace } from "@rbxts/services";
import { GunSide } from "shared/Types";

interface Cam extends UnitDefinition<"Cam"> {
	defaults?: {
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

	offset?: CFrame;

	change_view_model: (this: ThisFabricUnit<"Cam">, view_model: Instance) => void;

	aim_down_sight: (this: ThisFabricUnit<"Cam">, sight_attachment: Attachment) => void;

	aim_up: (this: ThisFabricUnit<"Cam">) => void;

	// We need to make a settings to change gun side, call this function!
	change_gun_side: (this: ThisFabricUnit<"Cam">, gun_side: GunSide) => void;

	adjust_camera: (this: ThisFabricUnit<"Cam">) => void;
}

declare global {
	interface FabricUnits {
		Cam: Cam;
	}
}

let camera = Workspace.CurrentCamera!;
Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(() => {
	camera = Workspace.CurrentCamera!;
});

const player = Players.LocalPlayer;

export = identity<Cam>({
	name: "Cam",

	onInitialize: function (this) {
		player.CameraMode = Enum.CameraMode.LockFirstPerson;
	},

	change_view_model: function (this, view_model) {
		this.addLayer("ViewModel", { view_model });
	},

	aim_down_sight: function (this, s) {
		for (let i = 0; i < 60; i++) {
			this.offset = this.offset?.Lerp(s.CFrame, i / 60);
		}

		this.addLayer("Camera", { current_camera_cframe: s.CFrame, camera_type: Enum.CameraType.Scriptable });
	},

	aim_up: function (this) {
		this.removeLayer("Camera");
	},

	change_gun_side: function (this, side) {
		this.addLayer("gun_side", { right_handed: side === GunSide.Right });
	},

	adjust_camera: function (this) {},

	effects: [
		function (this) {
			const recoil_speed = this.get("recoil_speed");
			const recoil_height = this.get("recoil_height");
			const recoil_collected = this.get("recoil_collected");
			const now = this.get("now");
			const last_shot = this.get("last_shot");

			const recoil_amount =
				math.clamp(
					-recoil_speed *
						(now -
							last_shot.match(
								(n) => n,
								() => now,
							)) +
						recoil_height,
					-recoil_collected / recoil_speed,
					recoil_height,
				) ?? 0;

			const goal = camera.CFrame.mul(
				CFrame.Angles(
					math.rad((recoil_amount <= 0 && recoil_collected <= 0 ? -(math.cos(now) / 5) : 0) + recoil_amount),
					0,
					0,
				),
			);

			camera.CFrame = camera.CFrame.Lerp(goal, 0.5);
		},

		function (this) {
			const view_model = this.get("view_model");

			if (camera && view_model.FindFirstChild("Handle")) {
				const handle = view_model.FindFirstChild("Handle") as Part;

				if (!handle) return;

				handle.CFrame = camera.CFrame.mul(this.get("offset"));

				const left_arm = view_model.FindFirstChild("Left") as Part;
				const right_arm = view_model.FindFirstChild("Right") as Part;

				left_arm.CFrame = (handle?.FindFirstChild("LeftArmAttach") as Attachment).WorldCFrame?.mul(
					CFrame.Angles(0, math.rad(180), 0),
				)?.mul(new CFrame(left_arm.Size.X, 0, 0));

				right_arm.CFrame = (handle?.FindFirstChild("RightArmAttach") as Attachment).WorldCFrame?.mul(
					CFrame.Angles(0, math.rad(180), 0),
				)?.mul(new CFrame(right_arm.Size.X, 0, 0));
			}
		},
	],
});
