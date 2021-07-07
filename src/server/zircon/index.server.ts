import Zircon, { ZirconServer, ZirconFunctionBuilder } from "@rbxts/zircon";
import Log, { Logger } from "@rbxts/log";
import print_message from "./commands/print_message";
import kick from "./commands/kick";
import { ZirconRegistryService } from "@rbxts/zircon/out/Services/RegistryService";
import { match } from "shared/rbxts-pattern";
import give_temp_admin from "./commands/give_temp_admin";

Log.SetLogger(Logger.configure().WriteTo(Zircon.Log.Console()).Create());

const registry = ZirconServer.Registry;

export type ListCommand = (
	registry: typeof ZirconRegistryService & {
		readonly __nominal_Lazy: unknown;
	},
	builder: typeof ZirconFunctionBuilder,
) => void;

enum Commands {
	give_temp_admin,
	print_message,
	kick,
}

function buildCommand(commandName: Commands) {
	return match(commandName)
		.with(Commands.give_temp_admin, () => give_temp_admin)
		.with(Commands.print_message, () => print_message)
		.with(Commands.kick, () => kick)
		.run();
}

function buildCommands(...parameters: Parameters<ListCommand>) {
	for (const [_, commandName] of pairs(Commands)) {
		buildCommand(commandName)(...parameters);
	}
}

buildCommands(registry, ZirconFunctionBuilder);

Promise.delay(5).then(() => {
	Log.Verbose("A verbose message. Yes?");
	Log.Debug("A debug message, yes");
	Log.Info("Hello, {Test}! {Boolean} {Number} {Array}", "Test string", true, 10, [1, 2, 3, [4]]);
	Log.Warn("Warning {Lol}", "LOL!");
	Log.Error("ERROR LOL {Yes}", true);
	Log.Fatal("Fatal message here");
});
