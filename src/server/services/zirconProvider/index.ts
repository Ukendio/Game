import Zircon, { ZirconServer, ZirconFunctionBuilder } from "@rbxts/zircon";
import Log, { Logger } from "@rbxts/log";
import print_message from "./commands/print";
import kick from "./commands/kick";
import { ZirconRegistryService } from "@rbxts/zircon/out/Services/RegistryService";
import give_temp_admin from "./commands/admin";
import { OnInit, Service } from "@flamework/core";

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

@Service({ loadOrder: 1 })
export class ZirconProvider implements OnInit {
	onInit(): void {
		buildCommands(registry, ZirconFunctionBuilder);
		print("init on server");
	}
}
