import { OnInit, Service } from "@flamework/core";
import store from "server/core/rodux/store";
import remotes from "shared/Remotes";
import Log from "@rbxts/log";
import { TopicFormat } from "shared/Types";
import { Option } from "@rbxts/rust-classes";
import { getVoteOrDefault } from "./getVoteOrDefault";

const serverEvents = remotes.Server;
const clientAppendVote = serverEvents.Create("clientAppendVote");
const council_vote_on = serverEvents.Create("councilVoteOn");
const council_stop_vote = serverEvents.Create("councilStopVote");

@Service({
	loadOrder: 4,
})
export class Election implements OnInit {
	constructor() {}

	onInit() {
		//TODO: sanitize event
		clientAppendVote.Connect((player, vote) => {
			store.dispatch({ type: "cast_vote", player: player, vote: vote });
			Log.Info("{} has voted on {}", player, vote);
		});
	}

	async voteOn(topic: TopicFormat) {
		store.dispatch({
			type: "create_topic",
			topic: Option.some(topic),
		});

		store.dispatch({ type: "start_vote" });

		council_vote_on.SendToAllPlayers({
			name: topic.name,
			options: topic.options.asPtr(),
		});

		return Promise.delay(1).then(() => {
			store.dispatch({ type: "stop_vote" });
			council_stop_vote.SendToAllPlayers();

			store.dispatch({
				type: `select_${topic.name as "map" | "gamemode"}`,
				selection: getVoteOrDefault(store.getState().election.votes, topic.options),
			});
		});
	}
}
