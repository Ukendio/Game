import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import ColourScheme from "../ColourScheme";

const Diamond: Hooks.FC = () => {
	return (
		<frame
			Rotation={45}
			Size={UDim2.fromOffset(5, 5)}
			Position={UDim2.fromScale(0.5, 1)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={ColourScheme.White}
		/>
	);
};

export = new Hooks(Roact)(Diamond);
