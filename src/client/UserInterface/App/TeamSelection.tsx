import Roact from "@rbxts/roact";
import TeamButton from "../Components/TeamButton";

class TeamSelection extends Roact.Component {
	render() {
		return (
			<frame Size={UDim2.fromOffset(400, 400)}>
				<uigridlayout FillDirectionMaxCells={2} CellSize={UDim2.fromScale(0.5, 0.5)} />
				<TeamButton teamIndex={0} />
				<TeamButton teamIndex={1} />
				<TeamButton teamIndex={2} />
				<TeamButton teamIndex={3} />
			</frame>
		);
	}
}

export = TeamSelection;
