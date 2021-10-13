import { ContextActionService, Players, RunService, StarterGui, UserInputService, Workspace } from "@rbxts/services";
import Input from "./input";
import { SPIRIT_SETTINGS } from "./settings";
import Spring from "./spring";
import PlayerState from "./playerState";

let camera = Workspace.CurrentCamera!;
{
	Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(() => {
		const newCamera = Workspace.CurrentCamera;
		if (newCamera) camera = newCamera;
	});
}

let cameraPosition = new Vector3();
let cameraRotation = new Vector2();
let cameraFieldOfView = 0;

function getFocusDistance(cameraFrame: CFrame) {
	const zNear = 0.1;
	const viewPort = camera.ViewportSize;
	const projY = 2 * math.tan(cameraFieldOfView / 2);
	const projX = (viewPort.X / viewPort.Y) * projY;
	const fx = cameraFrame.RightVector;
	const fy = cameraFrame.UpVector;
	const fz = cameraFrame.LookVector;

	let minimumVector = new Vector3();
	let minimumDistance = 512;

	for (let x = 0; x < 1; x += 0.5) {
		for (let y = 0; y < 1; y += 0.5) {
			const cx = (x - 0.5) * projX;
			const cy = (y - 0.5) * projY;
			const offset = fx.mul(cx).sub(fy.mul(cy)).add(fz);
			const origin = cameraFrame.Position.add(offset.mul(zNear));

			const result = Workspace.Raycast(origin, offset.Unit.mul(minimumDistance));
			if (result) {
				const distance = result.Position.sub(origin).Magnitude;
				if (minimumDistance > distance) {
					minimumDistance = distance;
					minimumVector = offset.Unit;
				}
			}
		}
	}

	return fz.Dot(minimumVector) * minimumDistance;
}

const velSpring = new Spring(SPIRIT_SETTINGS.VEL_STIFFNESS, new Vector3());
const panSpring = new Spring(SPIRIT_SETTINGS.PAN_STIFFNESS, new Vector2());
const fovSpring = new Spring(SPIRIT_SETTINGS.FOV_STIFFNESS, 0 as number);

function stepFreeCamera(dt: number) {
	const vel = velSpring.update(dt, Input.vel(dt));
	const pan = panSpring.update(dt, Input.pan(dt));
	const fov = fovSpring.update(dt, Input.fov(dt));

	const zoomFactor = math.sqrt(math.tan(math.rad(70 / 20)) / math.tan(math.rad(cameraFieldOfView / 2)));

	cameraFieldOfView = math.clamp(cameraFieldOfView + fov * SPIRIT_SETTINGS.FOV_GAIN * (dt / zoomFactor), 1, 120);
	cameraRotation = cameraRotation.add(pan.mul(SPIRIT_SETTINGS.PAN_GAIN).mul(dt / zoomFactor));
	cameraRotation = new Vector2(
		math.clamp(cameraRotation.X, -SPIRIT_SETTINGS.PITCH_LIMIT, SPIRIT_SETTINGS.PITCH_LIMIT),
		cameraRotation.Y % (2 * math.pi),
	);

	const cameraCFrame = new CFrame(cameraPosition).mul(
		CFrame.fromOrientation(cameraRotation.X, cameraRotation.Y, 0).mul(
			new CFrame(vel.mul(SPIRIT_SETTINGS.NAV_GAIN).mul(dt)),
		),
	);
	cameraPosition = cameraCFrame.Position;

	camera.CFrame = cameraCFrame;
	camera.Focus = cameraCFrame.mul(new CFrame(0, 0, -getFocusDistance(cameraCFrame)));
	camera.FieldOfView = cameraFieldOfView;
}

export function startFreeCamera(): void {
	while (camera.CameraSubject === undefined) {
		RunService.Heartbeat.Wait();
	}
	const cameraCFrame = camera.CFrame;
	cameraRotation = new Vector2(cameraCFrame.ToEulerAnglesYXZ() as never);
	cameraPosition = cameraCFrame.Position;
	cameraFieldOfView = camera.FieldOfView;

	velSpring.reset(new Vector3());
	panSpring.reset(new Vector2());
	fovSpring.reset(0);

	PlayerState.push(camera);
	RunService.BindToRenderStep("FreeCamera", Enum.RenderPriority.Camera.Value, stepFreeCamera);
	Input.startCapture();
}

export function stopFreeCamera(): void {
	Input.stopCapture();
	RunService.UnbindFromRenderStep("FreeCamera");
	PlayerState.pop(camera);
}
