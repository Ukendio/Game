import Zircon, { ZirconServer, ZirconFunctionBuilder } from "@rbxts/zircon";
import Log, { Logger } from "@rbxts/log";
import print_message from "./commands/print";
import kick from "./commands/kick";
import { ZirconRegistryService } from "@rbxts/zircon/out/Services/RegistryService";
import { match, __ } from "@rbxts/rbxts-pattern";
import give_temp_admin from "./commands/admin";
import { OnInit, OnStart, Service } from "@flamework/core";

Log.SetLogger(Logger.configure().WriteTo(Zircon.Log.Console()).Create());

const registry = ZirconServer.Registry;

export type ListCommand = (
	registry: typeof ZirconRegistryService & {
		readonly __nominal_Lazy: unknown;
	},
	builder: typeof ZirconFunctionBuilder,
) => void;

const commands = {
	give_temp_admin: give_temp_admin,
	print_message: print_message,
	kick: kick,
};

function buildCommands(...parameters: Parameters<ListCommand>) {
	for (const [commandName] of pairs(commands)) {
		commands[commandName](...parameters);
	}
}

@Service({ loadOrder: 0 })
export class ZirconProvider implements OnInit, OnStart {
	onInit() {
		buildCommands(registry, ZirconFunctionBuilder);
	}

	onStart() {
		Promise.delay(5).then(() => {
			Log.Verbose("A verbose message. Yes?");
			Log.Debug("A debug message, yes");
			Log.Info("Hello, {Test}! {Boolean} {Number} {Array}", "Test string", true, 10, [1, 2, 3, [4]]);
			Log.Warn("Warning {Lol}", "LOL!");
			Log.Error("ERROR LOL {Yes}", true);
			Log.Fatal("Fatal message here");
		});
	}
}
