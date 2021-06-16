import Net from "@rbxts/net";
import { Config, TopicFormat } from "shared/Types";

const remotes = Net.Definitions.Create({
	ServerCreateHealthPack: Net.Definitions.ServerToClientEvent<[Model]>(),
	ServerCreateGun: Net.Definitions.ServerToClientEvent<[Tool, Config]>(),
	ServerCreateHero: Net.Definitions.ServerToClientEvent<[Player]>(),
	ServerCreateMelee: Net.Definitions.ServerToClientEvent<[Tool]>(),
	ServerCreateTag: Net.Definitions.ServerToClientEvent<[Model]>(),

	CouncilVoteOn: Net.Definitions.ServerToClientEvent<[TopicFormat]>(),
	CouncilStopVote: Net.Definitions.ServerToClientEvent(),
	UICountdown: Net.Definitions.ServerToClientEvent<[number, string, string]>(),
	UIScoreboardUpdate: Net.Definitions.ServerToClientEvent<[string]>(),
	RoundStarted: Net.Definitions.ServerToClientEvent(),

	ClientRequestDeploy: Net.Definitions.ServerAsyncFunction<() => boolean | Model>(),

	ClientAppendVote: Net.Definitions.ClientToServerEvent<[string]>(),
	ClientChooseTeam: Net.Definitions.ClientToServerEvent<[Team]>(),
});

export default remotes;
