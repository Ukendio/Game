import Roact from "@rbxts/roact";

interface Props {
	image: string;
}
interface State {}

export class VotingOption extends Roact.Component<Props, State> {
	render() {
		return (
			<imagebutton Key={"VotingOption"} Size={new UDim2(1 / 3, 0, 1, 0)} Image={this.props.image}></imagebutton>
		);
	}
}
