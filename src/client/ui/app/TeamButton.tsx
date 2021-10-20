import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";

import { match } from "@rbxts/rbxts-pattern";
import store from "../../core/rodux/store";
import { Option } from "@rbxts/rust-classes";
import { PlayerTeam } from "shared/Types";

interface Props {
	side: "Left" | "Right";
}

const teamButton: Hooks.FC<Props> = (props, { useState }) => {
	const transform = (
		...args: [BrickColor, UDim2, Vector2]
	): { Color: BrickColor; Position: UDim2; Anchor: Vector2 } => {
		return {
			Color: args[0],
			Position: args[1],
			Anchor: args[2],
		};
	};
	const specificIndex = match(props.side)
		.with("Left", () => transform(new BrickColor(255, 60, 35), UDim2.fromScale(0, 0.5), new Vector2(0, 0.5)))
		.with("Right", () => transform(new BrickColor(58, 147, 255), UDim2.fromScale(1, 0.5), new Vector2(1, 0.5)))
		.exhaustive();

	const getTeam = (color: BrickColor): Option<PlayerTeam> => {
		return store
			.getState()
			.team.teams.iter()
			.find((current) => current.tag.TeamColor === color);
	};

	const thisTeam = getTeam(specificIndex.Color);

	const [memberCount, setMemberCount] = useState(thisTeam.unwrap().members.len());

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
					MouseButton1Click: (): void => setMemberCount(memberCount + 1),
				}}
			/>
		</frame>
	);
};

export = new Hooks(Roact)(teamButton);
