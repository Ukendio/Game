import Roact from "@rbxts/roact";
import { match } from "shared/rbxts-pattern";
import store from "shared/Rodux/store";

interface Props {
	teamIndex: number;
}

interface State {
	memberCount: number;
}

class TeamButton extends Roact.Component<Props, State> {
	state = identity<State>({
		memberCount: 0,
	});

	didMount() {
		//TODO: on mouseButtonClick, send event to server which sends an event to everyone except THIS client to update memberCount
	}
	render() {
		const transform = (...args: [BrickColor, UDim2, Vector2]) => {
			return {
				Color: args[0],
				Position: args[1],
				Anchor: args[2],
			};
		};
		const specificIndex = match(this.props.teamIndex)
			.with(0, () => transform(new BrickColor(252, 255, 69), UDim2.fromScale(0.5, 0), new Vector2(0.5, 0)))
			.with(1, () => transform(new BrickColor(255, 60, 35), UDim2.fromScale(0, 0.5), new Vector2(0, 0.5)))
			.with(2, () => transform(new BrickColor(58, 147, 255), UDim2.fromScale(1, 0.5), new Vector2(1, 0.5)))
			.with(3, () => transform(new BrickColor(206, 25, 164), UDim2.fromScale(0, 1), new Vector2(1, 1)))
			.with(4, () => transform(new BrickColor(49, 255, 73), UDim2.fromScale(0.5, 1), new Vector2(0.5, 1)))
			.with(5, () => transform(new BrickColor(206, 206, 206), UDim2.fromScale(1, 1), new Vector2(0, 1)))
			.run();

		const getTeam = (color: BrickColor) => {
			return store
				.getState()
				.teams.iter()
				.find((current) => current.tag.TeamColor === color)
				.unwrap();
		};

		const thisTeam = getTeam(specificIndex.Color);

		return (
			<frame Key={this.props.teamIndex} Rotation={45}>
				<uiaspectratioconstraint />
				<uicorner CornerRadius={new UDim(0, 12)} />
				<textbutton
					Rotation={-45}
					Text={this.props.teamIndex === 5 ? "Spec" : tostring(this.state.memberCount)}
					BackgroundColor={specificIndex.Color}
					Position={specificIndex.Position}
					AnchorPoint={specificIndex.Anchor}
					Visible={this.props.teamIndex === 3 ? false : true}
					Event={{
						MouseButton1Click: () => {
							this.setState({
								memberCount: thisTeam.members.len(),
							});
						},
					}}
				/>
			</frame>
		);
	}
}

export = TeamButton;
