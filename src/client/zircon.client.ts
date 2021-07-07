import Log, { Logger } from "@rbxts/log";
import { Players } from "@rbxts/services";
import Zircon, { ZirconClient } from "@rbxts/zircon";

Log.SetLogger(Logger.configure().WriteTo(Zircon.Log.Console()).EnrichWithProperty("Version", PKG_VERSION).Create());

ZirconClient.BindConsole({
	EnableTags: true,
	Keys: [Enum.KeyCode.T],
});

Promise.delay(10).then(() => {
	Log.Verbose("Verbose message pls");
	Log.Info("Hello, {Test}! {Boolean} {Number} {Array}", "Test string", true, 10, [1, 2, 3, [4]]);
	Log.Info("Should be good {Number}", 1);
	Log.Info(
		`String {String}, Number {Number}, Boolean {Boolean}, Array: {Array}, Map: {Map}, Instance: {Instance}, Undefined: {Undefined}, None: {None}`,
		"Hello, World!",
		1337,
		true,
		[1, "two", true],
		{ value: "hi" },
		Players.LocalPlayer,
		undefined,
	);
	Log.Debug("test", "testing debug");
	Log.Warn("test warning lol");
	Log.Error("test error lol");
	Log.Fatal("wtf lol");
});
