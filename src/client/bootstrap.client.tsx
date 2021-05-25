import Roact from "@rbxts/roact";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { Crosshair } from "./App/Crosshair";

const player = Players.LocalPlayer;
const mouse = player.GetMouse();
player.CameraMode = Enum.CameraMode.LockFirstPerson;
UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;

const SETTINGS = {
	fireRate: 1,
	recoil: 1,
};
Roact.mount(
	<screengui ZIndexBehavior="Sibling">
		<Crosshair
			mouseOffset={Workspace.CurrentCamera!.ViewportSize.Y / 2 - 36}
			fireRate={SETTINGS.fireRate}
			recoil={SETTINGS.recoil}
		/>
	</screengui>,
	player.WaitForChild("PlayerGui"),
);
