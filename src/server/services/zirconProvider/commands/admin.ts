import Log from "@rbxts/log";
import { match, when, __ } from "@rbxts/rbxts-pattern";
import { Option } from "@rbxts/rust-classes";
import { ListCommand } from "..";

enum Period {
	Temporary,
	Permanent,
}

function parsePeriod(str: string): Option<Period> {
	if (str.find("perm")[0] !== undefined) return Option.some(Period.Permanent);
	else if (str.find("temp")[0] !== undefined) return Option.some(Period.Temporary);
	return Option.none();
}

export = (...parameters: Parameters<ListCommand>): void => {
	const registry = parameters[0];

	registry.RegisterFunction(
		new parameters[1]("admin")
			.AddArguments("player")
			.AddArguments("string")
			.Bind((context, player, position) => {
				const executor = context.GetExecutor();

				if (!registry.Administrator.HasMember(player)) {
					registry.Administrator.AddMember(player);

					parsePeriod(position).match(
						(period) => {
							match(period)
								.with(Period.Permanent, () => {
									//TODO we have to save the player when it is permanent in a datastore
								})
								.with(Period.Temporary, () => {
									Log.Info("{} gave admin to {} temporarily", executor, player);
								})
								.with(__, () => {
									throw Log.Fatal("Unexpected Error");
								})
								.exhaustive();
						},
						() =>
							Log.Error("Invalid Period, expected `string` to have `perm` or `temp`, got `{}`", position),
					);
				} else {
					Log.Error("User already has Administrator");
				}
			}),
		[registry.Creator],
	);
};
