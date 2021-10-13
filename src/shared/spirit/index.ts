import { startFreeCamera, stopFreeCamera } from "shared/spirit/toggle";
import { SPIRIT_SETTINGS } from "shared/spirit/settings";
import { ContextActionService } from "@rbxts/services";

namespace Spirit {
	let enabled = false;
	export function bind(key: Enum.KeyCode): void {
		const handleActivationInput = (action: string, state: Enum.UserInputState, input: InputObject) => {
			if (state === Enum.UserInputState.Begin) {
				if (input.KeyCode === key) {
					if (enabled) mount();
					else free();
				}
			}

			return Enum.ContextActionResult.Pass;
		};

		ContextActionService.BindActionAtPriority(
			"FreeCameraToggle",
			handleActivationInput,
			false,
			SPIRIT_SETTINGS.TOGGLE_INPUT_PRIORITY,
			key,
		);
	}

	export function unbind(): void {
		ContextActionService.UnbindAction("FreeCameraToggle");
	}

	type Settings = typeof SPIRIT_SETTINGS;
	export function shape<K extends keyof Settings>(key: K, value: Settings[K]): void {
		SPIRIT_SETTINGS[key] = value;
	}

	export function free(): void {
		startFreeCamera();
		enabled = true;
	}

	export function mount(): void {
		stopFreeCamera();
		enabled = false;
	}
}

export = Spirit;
