import { NonNullableObject } from "@rbxts/fabric";
import Unit from "@rbxts/fabric/src/FabricLib/Fabric/Unit";
import { Flamework } from "@rbxts/flamework";
import Net from "@rbxts/net";
import { TLayerData } from "./Types";

const define = Net.Definitions;

const remotes = define.Create({
	UICountdown: define.ServerToClientEvent<[number, string, string]>(),
	UIScoreboardUpdate: define.ServerToClientEvent<[string]>(),
	updateScoreBoard: define.ServerToClientEvent<[string]>(),

	roundStarted: define.ServerToClientEvent(),
	councilVoteOn: define.ServerToClientEvent<[{ name: string; options: string[] }]>(),
	councilStopVote: define.ServerToClientEvent(),

	constructUnit: define.ServerToClientEvent<
		[keyof FabricUnits, Instance | Unit<keyof FabricUnits>, NonNullableObject<TLayerData<keyof FabricUnits>>]
	>(),

	userRequestDeploy: define.ServerAsyncFunction<() => boolean>(),

	clientAppendVote: define.ClientToServerEvent<[string]>(),
});

export default remotes;
