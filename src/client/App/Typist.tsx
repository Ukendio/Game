import Roact from "@rbxts/roact";
import { Players, RunService } from "@rbxts/services";

interface Props {
	interval: number;
	finalText: string;
}
interface State {
	maxGraph: number;
}

function removeTags(text: string) {
	text = (text.gsub("<br&s*/>", "\n") as unknown) as string;
	return (text.gsub("<[^<>]->", "") as unknown) as string;
}

function now() {
	return DateTime.now().UnixTimestampMillis / 1000;
}

function fastWait(n: number) {
	const step = now() + n;
	while (now() < step) {
		RunService.Heartbeat.Wait();
	}
	return n;
}

export class Typist extends Roact.Component<Props, State> {
	state: State = {
		maxGraph: 0,
	};

	didMount() {
		coroutine.wrap(() => {
			const displayText = removeTags(this.props.finalText);
			let index = 0;
			for (const [first, last] of utf8.graphemes(displayText)) {
				const grapheme = displayText.sub(first, last);
				index++;
				this.setState({
					maxGraph: index,
				});
				fastWait(this.props.interval);
			}
		})();
	}
	render(): Roact.Element {
		const current = this.state.maxGraph;
		return (
			<textlabel
				Size={new UDim2(0, 200, 0, 50)}
				RichText={true}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Text={this.props.finalText}
				MaxVisibleGraphemes={current}
			/>
		);
	}
}
