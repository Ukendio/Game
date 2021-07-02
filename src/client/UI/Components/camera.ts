import { Workspace, Players } from "@rbxts/services";

const mouse = Players.LocalPlayer.GetMouse();

const DEFAULT_CFRAME = new CFrame(new Vector3(-300, 215, 0));
const MAX_MOVE_X = 5;
const MAX_MOVE_Y = 5;

class UserCamera {
	private currentCamera = Workspace.CurrentCamera;
	private cameraEffects: { [index: string]: Instance } = {};

	constructor() {
		Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(() => {
			const newCamera = Workspace.CurrentCamera;
			if (newCamera) this.currentCamera = newCamera;
		});
	}

	moveCamera() {
		if (this.currentCamera) {
			const viewport = this.currentCamera.ViewportSize;
			const offsetFromCenterX = mouse.X / viewport.X - 0.5;
			const offsetFromCenterY = -(mouse.Y / viewport.Y - 0.5);

			this.currentCamera.CFrame = DEFAULT_CFRAME.mul(
				new CFrame(MAX_MOVE_X * offsetFromCenterX, MAX_MOVE_Y * offsetFromCenterY, 0),
			);
		}
	}

	setActorNone() {
		let cameraPart = Workspace.FindFirstChild("CameraPart") as Part;

		if (cameraPart === undefined) {
			cameraPart = new Instance("Part");
			cameraPart.Position = DEFAULT_CFRAME.Position.sub(new Vector3(0, 0, 5));
			cameraPart.Name = "CameraPart";
			cameraPart.Parent = Workspace;
			cameraPart.CanCollide = false;
			cameraPart.Anchored = true;
			cameraPart.Transparency = 0;
		}

		if (this.currentCamera && cameraPart) {
			this.currentCamera.CameraType = Enum.CameraType.Scriptable;
			this.currentCamera.CameraSubject = cameraPart;
			this.currentCamera.CFrame = DEFAULT_CFRAME;
		}
	}

	setActorUser(character: Model) {
		if (character && this.currentCamera) {
			const playerHumanoid: Humanoid = character.FindFirstChildOfClass("Humanoid")!;
			this.currentCamera.CameraSubject = playerHumanoid;
			this.currentCamera.CameraType = Enum.CameraType.Follow;
		}
	}

	addBlur(blurLevel: number) {
		if (this.cameraEffects["Blur"]) {
			this.cameraEffects["Blur"].Destroy();
		}
		const newBlur = new Instance("BlurEffect");
		newBlur.Size = blurLevel;
		newBlur.Parent = this.currentCamera;
		this.cameraEffects["Blur"] = newBlur;
	}

	removeBlur() {
		if (this.cameraEffects["Blur"]) {
			this.cameraEffects["Blur"].Destroy();
		}
	}
}

export = new UserCamera();
