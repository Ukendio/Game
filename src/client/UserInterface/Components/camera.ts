import { Workspace } from "@rbxts/services";

class UserCamera {
	private currentCamera = Workspace.CurrentCamera!;
	private cameraEffects: { [index: string]: Instance } = {};

	constructor() {
		Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(() => {
			const newCamera = Workspace.CurrentCamera;
			if (newCamera) this.currentCamera = newCamera;
		});
	}

	setActorNone() {
		print("Set Camera to Void!");
		// this.currentCamera.CameraSubject = Workspace.LobbyCamera;
		this.currentCamera.CameraType = Enum.CameraType.Scriptable;
		this.currentCamera.CFrame = new CFrame(new Vector3(-300, 215, 0));
	}

	setActorUser(character: Model) {
		if (character) {
			const playerHumanoid: Humanoid = character.FindFirstChildOfClass("Humanoid")!;
			this.currentCamera.CameraSubject = playerHumanoid;
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
