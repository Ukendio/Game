import { Teams } from "@rbxts/services";

export = function () {
	for (const team of Teams.GetChildren()) {
		team.Destroy();
	}
};
