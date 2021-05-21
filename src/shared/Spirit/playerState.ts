import { Players, StarterGui, UserInputService } from "@rbxts/services";

const screenGuis = new Array<ScreenGui>();
const coreGuis = {
	Backpack: true,
	Chat: true,
	Health: true,
	PlayerList: true,
};

const setCores = {
	BadgesNotificationsActive: true,
	PointsNotificationsActive: true,
};

let cameraFieldOfView = undefined! as number;
let cameraType = undefined! as Enum.CameraType;
let cameraCFrame = undefined! as CFrame;
let cameraFocus = undefined! as CFrame;
let cameraSubject = undefined! as Humanoid | BasePart;

let mouseIconEnabled = undefined! as boolean;
let mouseBehavior = undefined! as Enum.MouseBehavior;

namespace PlayerState {
	export function push(camera: Camera) {
		for (const [name] of pairs(coreGuis)) {
			coreGuis[name] = StarterGui.GetCoreGuiEnabled(Enum.CoreGuiType[name]);
			StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType[name], false);
		}
		for (const [name] of pairs(setCores)) {
			setCores[name] = StarterGui.GetCore(name);
			StarterGui.SetCore(name as keyof SettableCores, false);
		}
		const playerGui = Players.LocalPlayer.FindFirstChildOfClass("PlayerGui");
		if (playerGui) {
			for (const [_, gui] of pairs(playerGui.GetChildren())) {
				if (gui.IsA("ScreenGui") && gui.Enabled) {
					screenGuis.push(gui);
					gui.Enabled = true;
				}
			}
		}

		cameraFieldOfView = camera.FieldOfView;
		camera.FieldOfView = 70;

		cameraType = camera.CameraType;
		camera.CameraType = Enum.CameraType.Custom;

		cameraCFrame = camera.CFrame;
		cameraFocus = camera.Focus;

		cameraSubject = camera.CameraSubject!;

		mouseIconEnabled = UserInputService.MouseIconEnabled;
		UserInputService.MouseIconEnabled = false;

		mouseBehavior = UserInputService.MouseBehavior;
		UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
	}

	export function pop(camera: Camera) {
		for (const [name, isEnabled] of pairs(coreGuis)) {
			StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType[name], isEnabled);
		}
		for (const [name, isEnabled] of pairs(setCores)) {
			StarterGui.SetCore(name as keyof SettableCores, isEnabled);
		}
		screenGuis.forEach((gui) => {
			if (gui.Parent) {
				gui.Enabled = true;
			}
		});

		camera.FieldOfView = cameraFieldOfView;
		cameraFieldOfView = undefined!;

		camera.CFrame = cameraCFrame;
		cameraCFrame = undefined!;

		camera.CameraType = cameraType;
		cameraType = undefined!;

		camera.CameraSubject = cameraSubject;
		cameraSubject = undefined!;

		camera.Focus = cameraFocus;
		cameraFocus = undefined!;

		UserInputService.MouseIconEnabled = mouseIconEnabled;
		mouseIconEnabled = undefined!;

		UserInputService.MouseBehavior = mouseBehavior;
		mouseBehavior = undefined!;
	}
}

export = PlayerState;
