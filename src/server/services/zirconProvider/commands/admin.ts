import Log from "@rbxts/log";
import { match } from "shared/match";
import { ListCommand } from "..";

export = (...parameters: Parameters<ListCommand>) => {
	const registry = parameters[0];

	registry.RegisterFunction(
		new parameters[1]("admin")
			.AddArguments("player?")
			.AddArguments("string")
			.Bind((context, player, position) => {
				if (player && !registry.Administrator.HasMember(player)) {
					registry.Administrator.AddMember(player);

					match(position)
						.with("temporary" || "temp" || "temporarily", () => {
							Log.Info("{} Gave admin to {} temporarily", context.GetExecutor(), player);
						})
						.with("permanent" || "perm" || "permanently", () => {
							Log.Info("{} Gave admin to {} permanently", context.GetExecutor(), player);
							//TODO: Save
						})
						.run();
				} else {
					Log.Error("Invalid user");
				}
			}),
		[registry.Creator],
	);
};
