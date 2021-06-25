import Roact from "@rbxts/roact";
import { match } from "shared/rbxts-pattern";

interface Props {
	teamIndex: number;
}

class TeamButton extends Roact.Component<Props> {
	render() {
		return (
			<textbutton
				Text="Team"
				BackgroundColor3={match(this.props.teamIndex)
					.with(0, () => new Color3(255, 0, 0))
					.with(1, () => new Color3(0, 255, 0))
					.with(2, () => new Color3(0, 0, 255))
					.with(3, () => new BrickColor("Cool yellow").Color)
					.otherwise(() => new Color3())}
			/>
		);
	}
}

export = TeamButton;
