import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";

import { match } from "shared/match";
import store from "shared/rodux/store";

interface Props {
	side: "Left" | "Right";
}

interface State {
	memberCount: number;
}

const teamButton: Hooks.FC<Props> = (props, { useState }) => {
	const transform = (...args: [BrickColor, UDim2, Vector2]) => {
		return {
			Color: args[0],
			Position: args[1],
			Anchor: args[2],
		};
	};
	const specificIndex = match(props.side)
		.with("Left", () => transform(new BrickColor(255, 60, 35), UDim2.fromScale(0, 0.5), new Vector2(0, 0.5)))
		.with("Right", () => transform(new BrickColor(58, 147, 255), UDim2.fromScale(1, 0.5), new Vector2(1, 0.5)))
		.run();

	const getTeam = (color: BrickColor) => {
		return store
			.getState()
			.teams.iter()
			.find((current) => current.tag.TeamColor === color)
			.unwrap();
	};

	const thisTeam = getTeam(specificIndex.Color);

	const [memberCount, setMemberCount] = useState(0);
	return (
		<frame Rotation={45}>
			<uiaspectratioconstraint />
			<uicorner CornerRadius={new UDim(0, 12)} />
			<textbutton
				Rotation={-45}
				Text={tostring(memberCount)}
				BackgroundColor={specificIndex.Color}
				Position={specificIndex.Position}
				AnchorPoint={specificIndex.Anchor}
				Event={{
					MouseButton1Click: () => setMemberCount(memberCount + 1),
				}}
			/>
		</frame>
	);
};

export = new Hooks(Roact)(teamButton);
