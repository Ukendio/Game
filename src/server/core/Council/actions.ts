import Rodux from "@rbxts/rodux";

export interface StartVoteAction extends Rodux.Action<"StartVote"> {}

export function startVote(): StartVoteAction {
	return {
		type: "StartVote",
	};
}

export interface StopVoteAction extends Rodux.Action<"StopVote"> {}

export function stopVote(): StopVoteAction {
	return {
		type: "StopVote",
	};
}

export interface TopicFormat {
	name: string;
	options: string[];
}

export interface CreateTopicAction extends Rodux.Action<"CreateTopic"> {
	topic: TopicFormat;
}

export function createTopic(topic: TopicFormat): CreateTopicAction {
	return {
		type: "CreateTopic",
		topic: topic,
	};
}

export interface CastVoteAction extends Rodux.Action<"CastVote"> {
	player: Player;
	vote: string;
}

export function castVote(player: Player, vote: string): CastVoteAction {
	return {
		type: "CastVote",
		player: player,
		vote: vote,
	};
}
