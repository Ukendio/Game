import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import Diamond from "./Diamond";

interface Props extends Partial<WritableInstanceProperties<TextButton>> {
	HoverOn: Color3;
	HoverOff: Color3;
}

const Button: Hooks.FC<Props> = (props, { useState }) => {
	const [colour, setColour] = useState(props.HoverOff);

	return (
		<textbutton
			Text={props.Text}
			TextColor3={colour}
			BackgroundTransparency={1}
			Event={{
				MouseEnter: () => setColour(props.HoverOff),
				MouseLeave: () => setColour(props.HoverOn),
			}}
			{...props}
		>
			<Diamond />
		</textbutton>
	);
};

export = new Hooks(Roact)(Button);
