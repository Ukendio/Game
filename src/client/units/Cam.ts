import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Option } from "@rbxts/rust-classes";
import { Players, Workspace } from "@rbxts/services";
import { GunSide } from "shared/Types";

interface Cam extends UnitDefinition<"Cam"> {
	defaults?: {
		recoil_speed: number;
		recoil_height: number;
		offset: CFrame;

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
const character = player.Character ?? player.CharacterAdded.Wait()[0];
const humanoid = character?.FindFirstChildOfClass("Humanoid");

export = identity<Cam>({
	name: "Cam",

	defaults: {
		recoil_speed: 9,
		recoil_height: 0.7,
		offset: new CFrame(),

		current_camera_cframe: new CFrame(),
		camera_type: Enum.CameraType.Custom,
		right_handed: true,

		view_model: new Instance("Part"),
		last_shot: Option.none(),
		recoil_collected: 0,
	},

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

	adjust_camera: function (this) {
		const view_model = this.get("view_model");
		const recoil_speed = this.get("recoil_speed");
		const recoil_height = this.get("recoil_height");
		const recoil_collected = this.get("recoil_collected");
		const last_shot = this.get("last_shot");

		if (!view_model) return;

		if (humanoid && camera && humanoid.RootPart && humanoid.MoveDirection.Magnitude <= 0) {
			const now = os.time();
			const amount = -(math.cos(now) / 5);

			const recoil_amount =
				math.clamp(
					-recoil_speed *
						(os.clock() -
							last_shot.match(
								(n) => n,
								() => os.clock(),
							)) +
						recoil_height,
					-recoil_collected / recoil_speed,
					recoil_height,
				) ?? 0;

			const Goal = camera.CFrame.mul(
				CFrame.Angles(
					math.rad((recoil_amount <= 0 && recoil_collected <= 0 ? amount : 0) + recoil_amount),
					0,
					0,
				),
			);

			camera.CFrame = camera.CFrame.Lerp(Goal, 0.5);
			this.addLayer("recoil", { recoil_collected: this.get("recoil_collected") + recoil_amount });

			if (recoil_amount <= 0 && this.get("recoil_collected") <= 0) {
				const X = math.cos(now * 9) / 5;
				const Y = math.abs(math.sin(now * 12)) / 5;
				const bobble = new Vector3(X, Y, 0).mul(
					math.min(1, humanoid.RootPart.Velocity.Magnitude / humanoid.WalkSpeed),
				);
				humanoid.CameraOffset = humanoid.CameraOffset.Lerp(bobble, 0.25);
			}
		} else if (humanoid && camera && humanoid.RootPart) {
			const recoil_amount = last_shot.isSome()
				? math.clamp(
						-recoil_speed * (os.clock() - last_shot.expect("no last shot")) + recoil_height,
						-recoil_collected / recoil_speed,
						recoil_height,
				  )
				: 0;
			camera.CFrame = camera.CFrame.Lerp(camera.CFrame.mul(CFrame.Angles(math.rad(recoil_amount), 0, 0)), 0.5);
			this.addLayer("recoil", { recoil_collected: this.get("recoil_collected") + recoil_amount });
		}

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

	effects: [
		function (this) {
			camera.CFrame = this.get("current_camera_cframe");
			camera.CameraType = this.get("camera_type");
		},
		function (this) {
			const view_model = this.get("view_model");

			if (view_model) view_model.Parent = camera;
		},
	],
});
