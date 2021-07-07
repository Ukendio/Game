import Log from "@rbxts/log";
import { ListCommand } from "../index.server";

export = (...parameters: Parameters<ListCommand>) => {
	const registry = parameters[0];

	registry.RegisterFunction(
		new parameters[1]("give_temp_admin").AddArguments("player?").Bind((context, player) => {
			if (player && registry.Administrator.HasMember(player)) {
				registry.Administrator.AddMember(player);
				Log.Info("Gave admin to {player}", player);
			} else {
				Log.Error("Invalid user");
			}
		}),
		[registry.Creator],
	);
};
