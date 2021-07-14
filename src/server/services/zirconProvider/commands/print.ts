import Log from "@rbxts/log";
import { ListCommand } from "..";

export = (...parameters: Parameters<ListCommand>) => {
	const registry = parameters[0];
	registry.RegisterFunction(
		new parameters[1]("print")
			.AddArguments("string")
			.Bind((context, message) =>
				Log.Info("Zircon says {message} from {player}", message, context.GetExecutor()),
			),
		[registry.User],
	);
};
