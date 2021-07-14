import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import TeamButton from "../app/TeamButton";

const teamSelection: Hooks.FC = () => {
	const children = new Array<Roact.Element>();
	for (const side of ["Left", "Right"] as const) {
		children.push(<TeamButton side={side} />);
	}
	return <frame Size={UDim2.fromOffset(350, 350)}>{...children}</frame>;
};

export = new Hooks(Roact)(teamSelection);
