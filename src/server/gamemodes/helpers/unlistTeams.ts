import { Teams } from "@rbxts/services";

export = function (): Promise<void> {
	return new Promise(() => {
		for (const team of Teams.GetChildren()) {
			team.Destroy();
		}
	});
};
