export const SPIRIT_SETTINGS = {
	TOGGLE_INPUT_PRIORITY: Enum.ContextActionPriority.Low.Value,
	INPUT_PRIORITY: Enum.ContextActionPriority.High.Value,
	FREE_CAMERA_MACRO_KB: [Enum.KeyCode.LeftShift, Enum.KeyCode.P],
	NAV_GAIN: new Vector3(1, 1, 1).mul(48),
	PAN_GAIN: new Vector2(0.75, 1).mul(8),
	FOV_GAIN: 300,
	PITCH_LIMIT: math.rad(90),
	VEL_STIFFNESS: 15,
	PAN_STIFFNESS: 10,
	FOV_STIFFNESS: 4.0,
};

export const DEVICE_SETTINGS = {
	NAV_GAMEPAD_SPEED: new Vector3(1, 1, 1),
	NAV_KEYBOARD_SPEED: new Vector3(1, 1, 1),
	PAN_MOUSE_SPEED: new Vector2(1, 1).mul(math.pi / 164),
	PAN_GAMEPAD_SPEED: new Vector2(1, 1).mul(math.pi / 8),
	FOV_WHEEL_SPEED: 1.0,
	FOV_GAMEPAD_SPEED: 0.25,
	NAV_ADJ_SPEED: 0.75,
	NAV_SHIFT_MUL: 0.25,
};
