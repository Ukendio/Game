import { Players, StarterGui, UserInputService } from "@rbxts/services";

const screenGuis = new Array<ScreenGui>();
const coreGuis: Partial<Record<Enum.CoreGuiType["Name"], boolean>> = {
	Backpack: true,
	Chat: true,
	Health: true,
	PlayerList: true,
};

const setCores = {
	BadgesNotificationsActive: true,
	PointsNotificationsActive: true,
};

let cameraFieldOfView: number;
let cameraType: Enum.CameraType;
let cameraCFrame: CFrame;
let cameraFocus: CFrame;
let cameraSubject: Humanoid | BasePart;

let mouseIconEnabled: boolean;
let mouseBehavior: Enum.MouseBehavior;

namespace PlayerState {
	export function push(camera: Camera): void {
		for (const [name] of pairs(coreGuis)) {
			coreGuis[name] = StarterGui.GetCoreGuiEnabled(name);
			StarterGui.SetCoreGuiEnabled(name, false);
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

	export function pop(camera: Camera): void {
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
		camera.CFrame = cameraCFrame;
		camera.CameraType = cameraType;
		camera.CameraSubject = cameraSubject;
		camera.Focus = cameraFocus;
		UserInputService.MouseIconEnabled = mouseIconEnabled;
		UserInputService.MouseBehavior = mouseBehavior;
	}
}

export = PlayerState;
