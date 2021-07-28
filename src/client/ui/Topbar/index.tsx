import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import Play from "./buttons/Play";

const TopBar: Hooks.FC = () => {
	return (
		<frame BorderSizePixel={0} Size={new UDim2(1, 0, 0, 60)} BackgroundTransparency={1}>
			<Play />
		</frame>
	);
};

export = new Hooks(Roact)(TopBar);
