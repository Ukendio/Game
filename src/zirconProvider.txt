import { Controller, OnInit } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import Zircon, { ZirconClient } from "@rbxts/zircon";

@Controller({})
export class ZirconProvider implements OnInit {
	onInit() {
		const configuredLog = Logger.configure()
			.WriteTo(Zircon.Log.Console())
			.EnrichWithProperty("Version", PKG_VERSION)
			.Create();

		Log.SetLogger(configuredLog);

		ZirconClient.BindConsole({
			EnableTags: true,
			Keys: [Enum.KeyCode.T],
		});
	}
}
