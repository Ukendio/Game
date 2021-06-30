import { ReplicatedStorage, RunService } from "@rbxts/services";
import TestEz from "@rbxts/testez";

if (RunService.IsStudio()) {
	TestEz.TestBootstrap.run([...ReplicatedStorage.tests.GetChildren()]);
}
