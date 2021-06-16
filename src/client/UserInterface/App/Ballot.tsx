import Roact from "@rbxts/roact";
import Vote from "client/UserInterface/Components/Vote";
import remotes from "shared/remotes";
import { TopicFormat } from "shared/Types";

interface State {
	topic: TopicFormat;
}
const CouncilVoteOn = remotes.Client.Get("CouncilVoteOn");

class Ballot extends Roact.Component {
	state: State = {
		topic: undefined! as TopicFormat,
	};

	didMount() {
		CouncilVoteOn.Connect((topic) => {
			this.setState({ topic: topic });
		});
	}
	render() {
		return (
			<frame Size={new UDim2(0, 400, 0, 250)}>
				<uiscale Scale={0.4} />
				<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 15)} />
				<Vote type={this.state.topic.name} option={this.state.topic.options[0]} />
				<Vote type={this.state.topic.name} option={this.state.topic.options[1]} />
				<Vote type={this.state.topic.name} option={this.state.topic.options[2]} />
			</frame>
		);
	}
}

export = Ballot;
