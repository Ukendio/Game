import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";

const ClickCounter: Hooks.FC = (_props, { useState }) => {
	const [counter, setCounter] = useState(0);

	return (
		<textbutton
			Text={tostring(counter)}
			TextSize={18}
			Position={new UDim2(0.5, -100, 0.5, -25)}
			Size={UDim2.fromOffset(200, 50)}
			Event={{ MouseButton1Click: () => setCounter(counter + 1) }}
		/>
	);
};

export = new Hooks(Roact)(ClickCounter);
