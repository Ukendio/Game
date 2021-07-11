import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import { Players } from "@rbxts/services";

const player = Players.LocalPlayer;

function interpolate(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

const redVignette: Hooks.FC = (_, { useState }) => {
	const [transparency, setTransparency] = useState(1);

	const humanoid = player.Character?.FindFirstChildOfClass("Humanoid");

	humanoid?.HealthChanged.Connect((health) => {
		const percent = health / humanoid.MaxHealth;
		setTransparency(interpolate(1.5, 0.05, 1 - percent));
	});

	return (
		<imagelabel
			Key="RedVignette"
			Image="rbxassetid://6688985935"
			Size={UDim2.fromScale(1, 1)}
			ImageTransparency={transparency}
		/>
	);
};

export = new Hooks(Roact)(redVignette);
