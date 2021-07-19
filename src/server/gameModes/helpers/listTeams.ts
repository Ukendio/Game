import { Vec } from "@rbxts/rust-classes";
import { Teams } from "@rbxts/services";
import store from "server/core/rodux/store";

export = async function (colours: BrickColor[]) {
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
