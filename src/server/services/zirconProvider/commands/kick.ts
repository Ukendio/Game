import Log from "@rbxts/log";
import { ListCommand } from "..";

export = (...parameters: Parameters<ListCommand>): void => {
	const registry = parameters[0];

	registry.RegisterFunction(
		new parameters[1]("kick").AddArguments("player?").Bind((context, player) => {
			if (player) {
				player.Kick();
				Log.Info("Kicked {player}", player);
			} else {
				Log.Error("Invalid user");
			}
		}),
		[registry.Creator],
	);
};
