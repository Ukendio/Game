import { Option, Result } from "@rbxts/rust-classes";
import { Workspace, Players } from "@rbxts/services";

const mouse = Players.LocalPlayer.GetMouse();

const DEFAULT_CFRAME = new CFrame(new Vector3(-300, 215, 0));
const MAX_MOVE_X = 5;
const MAX_MOVE_Y = 5;

const cameraPart = new Instance("Part");
cameraPart.Position = DEFAULT_CFRAME.Position.sub(new Vector3(0, 0, 5));
cameraPart.Name = "CameraPart";
cameraPart.Parent = Workspace;
cameraPart.CanCollide = false;
cameraPart.Anchored = true;
cameraPart.Transparency = 0;

interface MetaCamera {
	move: (this: MetaCamera) => this;
	set_actor: (this: MetaCamera, character: Option<Model>) => Option<this>;
	set_actor_none: (this: MetaCamera) => this;
	add_blur: (this: MetaCamera, blur_level: number) => Result<this, string>;
	remove_blur: (this: MetaCamera) => this;
}

export function getCamera(): MetaCamera {
	let currentCamera = Workspace.CurrentCamera!;

	Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(() => {
		const newCamera = Workspace.CurrentCamera;
		if (newCamera) currentCamera = newCamera;
	});

	return {
		move: function (this): MetaCamera {
			const viewport = currentCamera.ViewportSize;
			const offsetFromCenterX = mouse.X / viewport.X - 0.5;
			const offsetFromCenterY = -(mouse.Y / viewport.Y - 0.5);

			currentCamera.CFrame = DEFAULT_CFRAME.mul(
				new CFrame(MAX_MOVE_X * offsetFromCenterX, MAX_MOVE_Y * offsetFromCenterY, 0),
			);

			return this;
		},

		set_actor: function (this, character: Option<Model>): Option<MetaCamera> {
			return character.map((rig) => {
				const playerHumanoid = rig.FindFirstChildOfClass("Humanoid")!;
				currentCamera.CameraSubject = playerHumanoid;
				currentCamera.CameraType = Enum.CameraType.Follow;

				return this;
			});
		},

		set_actor_none: function (this): MetaCamera {
			cameraPart.Destroy();

			if (currentCamera && cameraPart) {
				currentCamera.CameraType = Enum.CameraType.Scriptable;
				currentCamera.CameraSubject = cameraPart;
				currentCamera.CFrame = DEFAULT_CFRAME;
			}

			return this;
		},

		add_blur: function <T>(this: T, blur_level: number): Result<T, string> {
			if (currentCamera.FindFirstChildOfClass("BlurEffect") !== undefined) {
				return Result.err("BlurEffect already exists");
			}

			const new_blur = new Instance("BlurEffect");
			new_blur.Size = blur_level;
			new_blur.Parent = currentCamera;

			return Result.ok(this);
		},

		remove_blur: function (this): MetaCamera {
			currentCamera.FindFirstChildOfClass("BlurEffect")?.Destroy();

			return this;
		},
	};
}
