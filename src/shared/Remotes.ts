import { Flamework } from "@rbxts/flamework";
import Net from "@rbxts/net";
import { Config, TopicFormat } from "shared/Types";

const remotes = Net.Definitions.Create({
	UICountdown: Net.Definitions.ServerToClientEvent<[number, string, string]>(),
	UIScoreboardUpdate: Net.Definitions.ServerToClientEvent<[string]>(),
	RoundStarted: Net.Definitions.ServerToClientEvent(),

	ClientRequestDeploy: Net.Definitions.ServerAsyncFunction<() => boolean | Model>(),
});

export default remotes;

interface ServerEvents {
	clientAppendVote(vote: string): void;
	clientChooseTeam(team: Team): void;
}

interface ClientEvents {
	unitConstructHealthPack(model: Model): void;
	unitConstructGun(tool: Tool, Configuration: Config): void;
	unitConstructHero(player: Player): void;
	unitConstructMelee(tool: Tool): void;
	unitConstructTag(model: Model): void;

	roundStarted(): void;
	councilVoteOn(topic: { name: string; options: string[] }): void;
	councilStopVote(): void;

	userRequestDeploy(): [boolean, Model | undefined];
	updateScoreBoard(playerName: string): void;
}

const events = Flamework.createEvent<ServerEvents, ClientEvents>();

export const serverEvents = events.server;
export const clientEvents = events.client;
