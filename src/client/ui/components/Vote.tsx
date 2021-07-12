import Roact from "@rbxts/roact";

interface Props {
	type: string;
	option: string;
}
interface State {}

class Vote extends Roact.Component<Props, State> {
	render() {
		return <textbutton Key={"VotingOption"} Size={new UDim2(1 / 3, 0, 1, 0)} Text={this.props.option}></textbutton>;
	}
}

export = Vote;
