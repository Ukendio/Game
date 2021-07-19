import { Vec } from "@rbxts/rust-classes";
import { Teams } from "@rbxts/services";
import type { Store } from "@rbxts/rodux";
import type { State, Actions } from "server/core/rodux/store";

export = async function (colours: BrickColor[], store: Store<State, Actions>) {
	colours.forEach((colour) => {
		const team = new Instance("Team");
		team.TeamColor = colour;
		team.Parent = Teams;

		store.dispatch({
			type: "EnlistTeam",
			team: {
				tag: team,
				kills: 0,
				deaths: 0,
				members: Vec.vec(),
			},
		});
	});
};
