import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import Play from "./buttons/Play";

const topBar: Hooks.FC = () => {
	return (
		<frame BorderSizePixel={0} Size={new UDim2(1, 0, 0, 60)} BackgroundTransparency={1}>
			<Play />
			<frame
				Size={new UDim2(1, 0, 0, 1)}
				BorderSizePixel={0}
				BackgroundTransparency={0.75}
				BackgroundColor3={Color3.fromRGB(237, 237, 237)}
			/>
		</frame>
	);
};

export = new Hooks(Roact)(topBar);
