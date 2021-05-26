import Roact from "@rbxts/roact";

interface Props {
	hit: string;
}

class HitMark extends Roact.Component<Props> {
	render() {
		return (
			<billboardgui AlwaysOnTop={true} Size={new UDim2(1, 25, 1, 25)}>
				<textlabel
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					TextScaled={true}
					BackgroundTransparency={1}
					Font={Enum.Font.GothamBlack}
					Text={this.props.hit}
					Size={new UDim2(1, 0, 1, 0)}
					TextColor3={new Color3(188, 0, 0)}
				/>
				<uisizeconstraint MaxSize={new Vector2(75, 75)} />
			</billboardgui>
		);
	}
}

export = HitMark;
