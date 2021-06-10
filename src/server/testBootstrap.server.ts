import { ReplicatedStorage, RunService } from "@rbxts/services";
import TestEz from "@rbxts/testez";

if (RunService.IsStudio()) {
	Promise.delay(1.2).then(() => TestEz.TestBootstrap.run([...ReplicatedStorage.TS.tests.GetChildren()]));
}
