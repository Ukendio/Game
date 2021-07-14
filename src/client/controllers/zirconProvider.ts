import { Controller, OnInit, OnStart } from "@rbxts/flamework";
import Log, { Logger } from "@rbxts/log";
import { Players } from "@rbxts/services";
import Zircon, { ZirconClient } from "@rbxts/zircon";

@Controller({})
export class ZirconProvider implements OnInit, OnStart {
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

	onStart() {
		Promise.delay(10).then(() => {
			Log.Verbose("Verbose message pls");
			Log.Info("I am {}, but you can call me {}", "Marcus", "Ukendio");
			Log.Debug("test", "testing debug");
			Log.Warn("test warning lol");
			Log.Error("test error lol");
			Log.Fatal("wtf lol");
		});
	}
}
