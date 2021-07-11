import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";

interface Props {
	buttonText: string;
	printMessage: string;
}

const PrintsOnClick: Hooks.FC<Props> = (props, { useCallback }) => {
	const doPrint = useCallback(() => {
		print(props.printMessage);
	});

	return (
		<textbutton Size={UDim2.fromScale(0.5, 0.5)} Text={props.buttonText} Event={{ Activated: () => doPrint() }} />
	);
};

export = new Hooks(Roact)(PrintsOnClick, {
	defaultProps: {
		buttonText: "Click me...",
		printMessage: "it was clicked!",
	},
});
