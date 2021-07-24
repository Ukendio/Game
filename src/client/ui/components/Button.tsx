import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import Diamond from "./Diamond";

interface Props extends Partial<WritableInstanceProperties<TextButton>> {
	hoverOn: Color3;
	hoverOff: Color3;
	handler: Callback;
}

const Button: Hooks.FC<Props> = (props, { useState }) => {
	const [colour, setColour] = useState(props.hoverOff);

	return (
		<textbutton
			Text={props.Text}
			TextColor3={colour}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Font={Enum.Font.SourceSansBold}
			Event={{
				MouseEnter: () => setColour(props.hoverOff),
				MouseLeave: () => setColour(props.hoverOn),
				MouseButton1Down: () => props.handler(),
			}}
			{...props}
		>
			<Diamond />
		</textbutton>
	);
};

export = new Hooks(Roact)(Button);
