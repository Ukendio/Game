import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import ColourScheme from "client/ui/ColourScheme";
import Button from "client/ui/components/Button";

const Play: Hooks.FC = () => {
	return <Button HoverOff={ColourScheme.Black} HoverOn={ColourScheme.Yellow} Text="PLAY" />;
};

export = new Hooks(Roact)(Play);
