import { ContextActionService, UserInputService } from "@rbxts/services";
import { DEVICE_SETTINGS, SPIRIT_SETTINGS } from "./settings";
const gamePad = {
	ButtonX: 0,
	ButtonY: 0,
	DPadDown: 0,
	ButtonL2: 0,
	ButtonR2: 0,
	Thumbstick1: new Vector3(),
	Thumbstick2: new Vector3(),
};

const keyboard = {
	W: 0,
	A: 0,
	S: 0,
	D: 0,
	E: 0,
	Q: 0,
	U: 0,
	H: 0,
	J: 0,
	K: 0,
	I: 0,
	Y: 0,
	Up: 0,
	Down: 0,
	LeftShift: 0,
	RightShift: 0,
};

const mouse = {
	Delta: new Vector2(),
	MouseWheel: 0,
};
function thumbstickCurve(x: number) {
	return (
		math.sign(x) *
		math.clamp((math.exp((2.0 * (math.abs(x) - 0.15)) / (1 - 0.15)) - 1) / (math.exp(0.15) - 1), 0, 1)
	);
}

namespace Input {
	let navSpeed = 1;

	export function vel(dt: number): Vector3 {
		navSpeed = math.clamp(navSpeed + dt * (keyboard.Up - keyboard.Down) * DEVICE_SETTINGS.NAV_ADJ_SPEED, 0.01, 4);

		const kGamepad = new Vector3(
			thumbstickCurve(gamePad.Thumbstick1.X),
			thumbstickCurve(gamePad.ButtonR2) - thumbstickCurve(gamePad.ButtonL2),
			thumbstickCurve(-gamePad.Thumbstick1.Y),
		).mul(DEVICE_SETTINGS.NAV_GAMEPAD_SPEED);

		const kKeyBoard = new Vector3(
			keyboard.D - keyboard.A + keyboard.K - keyboard.H,
			keyboard.E - keyboard.Q + keyboard.I - keyboard.Y,
			keyboard.S - keyboard.W + keyboard.J - keyboard.U,
		).mul(DEVICE_SETTINGS.NAV_KEYBOARD_SPEED);

		// eslint-disable-next-line prettier/prettier
		const shift = UserInputService.IsKeyDown(Enum.KeyCode.LeftShift) || UserInputService.IsKeyDown(Enum.KeyCode.RightShift);

		return kGamepad.add(kKeyBoard).mul(navSpeed * (shift ? DEVICE_SETTINGS.NAV_SHIFT_MUL : 1));
	}

	export function pan(dt: number): Vector2 {
		const kGamePad = new Vector2(
			thumbstickCurve(gamePad.Thumbstick2.Y),
			thumbstickCurve(-gamePad.Thumbstick2.X),
		).mul(DEVICE_SETTINGS.PAN_GAMEPAD_SPEED);

		const kMouse = mouse.Delta.mul(DEVICE_SETTINGS.PAN_MOUSE_SPEED);
		mouse.Delta = new Vector2();
		return kGamePad.add(kMouse);
	}

	export function fov(dt: number): number {
		const kGamePad = (gamePad.ButtonX - gamePad.ButtonY) * DEVICE_SETTINGS.FOV_GAMEPAD_SPEED;
		const kMouse = mouse.MouseWheel * DEVICE_SETTINGS.FOV_WHEEL_SPEED;
		mouse.MouseWheel = 0;
		return kGamePad + kMouse;
	}

	export function startCapture() {
		function keypress(action: string, state: Enum.UserInputState, input: InputObject) {
			keyboard[input.KeyCode.Name as never] = (state === Enum.UserInputState.Begin ? 1 : 0) as never;
			return Enum.ContextActionResult.Sink;
		}

		function gpButton(action: string, state: Enum.UserInputState, input: InputObject) {
			gamePad[input.KeyCode.Name as never] = (state === Enum.UserInputState.Begin ? 1 : 0) as never;
			return Enum.ContextActionResult.Sink;
		}

		function mousePan(action: string, state: Enum.UserInputState, input: InputObject) {
			const delta = input.Delta;
			mouse.Delta = new Vector2(-delta.Y, -delta.X);
			return Enum.ContextActionResult.Sink;
		}

		function thumb(action: string, state: Enum.UserInputState, input: InputObject) {
			gamePad[input.KeyCode.Name as never] = input.Position as never;
			return Enum.ContextActionResult.Sink;
		}

		function trigger(action: string, state: Enum.UserInputState, input: InputObject) {
			gamePad[input.KeyCode.Name as never] = input.Position.Z as never;
			return Enum.ContextActionResult.Sink;
		}

		function mouseWheel(action: string, state: Enum.UserInputState, input: InputObject) {
			mouse[input.UserInputType.Name as never] = -input.Position.Z as never;
			return Enum.ContextActionResult.Sink;
		}

		ContextActionService.BindActionAtPriority(
			"FreeCameraKeyboard",
			keypress,
			false,
			SPIRIT_SETTINGS.INPUT_PRIORITY,
			Enum.KeyCode.W,
			Enum.KeyCode.U,
			Enum.KeyCode.A,
			Enum.KeyCode.H,
			Enum.KeyCode.S,
			Enum.KeyCode.J,
			Enum.KeyCode.D,
			Enum.KeyCode.K,
			Enum.KeyCode.E,
			Enum.KeyCode.I,
			Enum.KeyCode.Q,
			Enum.KeyCode.Y,
			Enum.KeyCode.Up,
			Enum.KeyCode.Down,
		);

		ContextActionService.BindActionAtPriority(
			"FreeCameraMousePan",
			mousePan,
			false,
			SPIRIT_SETTINGS.INPUT_PRIORITY,
			Enum.UserInputType.MouseMovement,
		);
		ContextActionService.BindActionAtPriority(
			"FreeCameraMouseWheel",
			mouseWheel,
			false,
			SPIRIT_SETTINGS.INPUT_PRIORITY,
			Enum.UserInputType.MouseWheel,
		);
		ContextActionService.BindActionAtPriority(
			"FreeCameraGamePadButton",
			gpButton,
			false,
			SPIRIT_SETTINGS.INPUT_PRIORITY,
			Enum.KeyCode.ButtonX,
			Enum.KeyCode.ButtonY,
		);
		ContextActionService.BindActionAtPriority(
			"FreeCameraGamePadTrigger",
			trigger,
			false,
			SPIRIT_SETTINGS.INPUT_PRIORITY,
			Enum.KeyCode.ButtonR2,
			Enum.KeyCode.ButtonL2,
		);
		ContextActionService.BindActionAtPriority(
			"FreeCameraGamePadThumbstick",
			thumb,
			false,
			SPIRIT_SETTINGS.INPUT_PRIORITY,
			Enum.KeyCode.Thumbstick1,
			Enum.KeyCode.Thumbstick2,
		);
	}

	export function stopCapture() {
		function zero(t: object) {
			for (const [k, v] of pairs(t)) {
				t[k as never] = ((v as number) * 0) as never;
			}
		}

		navSpeed = 1;

		for (const device of [gamePad, keyboard, mouse]) {
			zero(device);
		}

		ContextActionService.UnbindAction("FreeCameraKeyboard");
		ContextActionService.UnbindAction("FreeCameraMousePan");
		ContextActionService.UnbindAction("FreeCameraMouseWheel");
		ContextActionService.UnbindAction("FreeCameraGamePadButton");
		ContextActionService.UnbindAction("FreeCameraGamePadTrigger");
		ContextActionService.UnbindAction("FreeCameraGamePadThumbstick");
	}
}

export = Input;
