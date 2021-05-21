import { ReplicatedStorage } from "@rbxts/services";
import TestEz from "@rbxts/testez";

TestEz.TestBootstrap.run([...ReplicatedStorage.TS.tests.GetChildren()]);
