import Roact from "@rbxts/roact";
import Vote from "client/UserInterface/Components/Vote";
import { TopicFormat } from "shared/Types";

interface Props {
	topic: TopicFormat;
}

class Ballot extends Roact.Component<Props> {
	render() {
		return (
			<frame Size={new UDim2(0, 400, 0, 250)}>
				<uiscale Scale={0.4} />
				<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 15)} />
				<Vote image={this.props.topic.options[0]} />
				<Vote image={this.props.topic.options[1]} />
				<Vote image={this.props.topic.options[2]} />
			</frame>
		);
	}
}

export = Ballot;
