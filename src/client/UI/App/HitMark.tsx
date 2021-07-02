import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";

interface Props {
	hit: string;
}

class HitMark extends Roact.Component<Props> {
	render() {
		const absoluteSize = Workspace.CurrentCamera!.ViewportSize.div(15);

		return (
			<billboardgui AlwaysOnTop={true} Size={UDim2.fromOffset(absoluteSize.X, absoluteSize.Y)}>
				<textlabel
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					TextScaled={true}
					BackgroundTransparency={1}
					Font={Enum.Font.GothamBlack}
					Text={this.props.hit}
					TextStrokeTransparency={0}
					Size={UDim2.fromScale(1, 1)}
					TextColor3={new Color3(188, 0, 0)}
				/>
				<uisizeconstraint MaxSize={new Vector2(75, 75)} />
			</billboardgui>
		);
	}
}

export = HitMark;
