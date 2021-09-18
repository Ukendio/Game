import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import ColourScheme from "../ColourScheme";

interface Props {
	name: string;
	icon: string;
	f: Callback;
}

const MainButton: Hooks.FC<Props> = ({ name, icon, f }, { useCallback }) => {
	return (
		<textbutton
			Key={name}
			Size={new UDim2(1, 0, 0, 75)}
			Event={{
				Activated: f,
			}}
			BackgroundColor3={ColourScheme.bg_blue}
		>
			<uicorner CornerRadius={new UDim(0, 8)} />
			<frame
				Key="Inner Frame"
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={new UDim2(1, -15, 1, -15)}
				Position={UDim2.fromScale(0.5, 0.5)}
				BorderSizePixel={0}
				BackgroundTransparency={1}
			>
				<uilistlayout Padding={new UDim(0, 10)} VerticalAlignment="Center" FillDirection="Horizontal" />
				<imagelabel
					AnchorPoint={new Vector2(0, 0.5)}
					Size={new UDim2(0, 100, 1, 0)}
					Image={icon}
					BorderSizePixel={0}
				>
					<uiaspectratioconstraint AspectRatio={1} DominantAxis="Width" AspectType="FitWithinMaxSize" />
				</imagelabel>
				<textlabel
					Size={new UDim2(1, -70, 1, 0)}
					Text={name}
					TextSize={35}
					TextColor3={new Color3(220, 220, 220)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					BorderSizePixel={0}
				/>
			</frame>
		</textbutton>
	);
};

export = new Hooks(Roact)(MainButton);
