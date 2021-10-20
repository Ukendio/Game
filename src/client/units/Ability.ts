import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { ContextActionService } from "@rbxts/services";

declare global {
	interface FabricUnits {
		Ability: AbilityDefinition;
	}
}

interface AbilityDefinition extends UnitDefinition<"Ability"> {
	bind: (
		this: ThisFabricUnit<"Ability">,
		name: string,
		handler: Callback,
		keyCode: Enum.KeyCode,
		cooldown: number,
	) => void;
	unbind: (this: ThisFabricUnit<"Ability">, name: string) => void;
}

const ability: AbilityDefinition = {
	name: "Ability",

	bind: function (this, name, handler, key, cooldown) {
		let nextExecute = -1;

		const createHandler = (action: string, state: Enum.UserInputState, inputObject: InputObject): void => {
			if (action === name && state === Enum.UserInputState.Begin && inputObject.KeyCode === key) {
				if (os.clock() > nextExecute) {
					handler();
					nextExecute = os.clock() + cooldown;
				}
			}
		};

		ContextActionService.BindAction(name, createHandler, true, key);
	},

	unbind: function (this, name) {
		ContextActionService.UnbindAction(name);
	},
};

export = ability;
