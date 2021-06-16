import { Teams } from "@rbxts/services";

export = async function () {
	for (const team of Teams.GetChildren()) {
		team.Destroy();
	}
};
