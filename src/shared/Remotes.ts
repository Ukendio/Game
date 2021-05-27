import Net from "@rbxts/net";
import { TopicFormat } from "server/core/Council";

const remotes = Net.Definitions.Create({
	ServerCreateHealthPack: Net.Definitions.ServerToClientEvent<[Model]>(),
	ServerCreatePistol: Net.Definitions.ServerToClientEvent<[Tool]>(),

	CouncilVoteOn: Net.Definitions.ServerToClientEvent<[TopicFormat]>(),
	CouncilStopVote: Net.Definitions.ServerToClientEvent(),
	UICountdown: Net.Definitions.ServerToClientEvent<[number, string, string]>(),
	UIScoreboardUpdate: Net.Definitions.ServerToClientEvent<[string]>(),
	RoundStarted: Net.Definitions.ServerToClientEvent(),

	ClientRequestDeploy: Net.Definitions.ServerAsyncFunction<Callback>(),

	ClientAppendVote: Net.Definitions.ClientToServerEvent<[string]>(),
	ClientChooseTeam: Net.Definitions.ClientToServerEvent<[Team]>(),
});

export default remotes;
