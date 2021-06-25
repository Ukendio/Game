import { Store } from "@rbxts/rodux";
import { Teams } from "@rbxts/services";
import { Actions, enlistTeam } from "shared/Rodux/actions";
import { State } from "shared/Rodux/reducer";

export = async function (colours: BrickColor[], store: Store<State, Actions>) {
	colours.forEach((colour) => {
		const team = new Instance("Team");
		team.TeamColor = colour;
		team.Parent = Teams;

		store.dispatch(
			enlistTeam({
				tag: team,
				kills: 0,
				deaths: 0,
				members: [],
			}),
		);
	});
};
