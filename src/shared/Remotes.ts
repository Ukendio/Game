import Net from "@rbxts/net";
import { TopicFormat } from "server/core/store/actions";

const remotes = Net.Definitions.Create({
	ServerCreateHealthPack: Net.Definitions.ServerToClientEvent<[Model]>(),
	ServerCreateGun: Net.Definitions.ServerToClientEvent<[Tool]>(),
	ServerCreateHero: Net.Definitions.ServerToClientEvent<[Player]>(),

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
