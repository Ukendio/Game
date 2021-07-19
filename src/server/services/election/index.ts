import { OnInit, OnStart, Service } from "@rbxts/flamework";
import { Vec } from "@rbxts/rust-classes";
import { gameModes } from "server/gameModes";
import store from "server/core/rodux/store";
import { match } from "shared/match";
import { getVoteOrDefault } from "./getVoteOrDefault";
import remotes from "shared/Remotes";
import { TopicFormat } from "shared/Types";
import Object from "@rbxts/object-utils";

const serverEvents = remotes.Server;

@Service({
	loadOrder: 5,
})
export class Election implements OnInit, OnStart {
	private clientAppendVote = serverEvents.Create("clientAppendVote");
	private councilVoteOn = serverEvents.Create("councilVoteOn");
	private councilStopVote = serverEvents.Create("councilStopVote");

	constructor() {}

	onInit() {
		this.clientAppendVote.Connect((player, vote) => this._castVote(player, vote));
	}

	onStart() {}

	async voteOn(topic: string) {
		if (topic === "GameMode") {
			store.dispatch({
				type: "CreateTopic",
				topic: { name: "Gamemode", options: Vec.vec(...Object.keys(gameModes)) },
			});
		} else if (topic === "Map") {
			store.dispatch({
				type: "CreateTopic",
				topic: {
					name: "Map",
					options: Vec.vec(...Object.keys(gameModes)),
				},
			});
		}

		store.dispatch({ type: "StartVote" });
		this.councilVoteOn.SendToAllPlayers(this._serializeTopic(store.getState().topic));

		return Promise.delay(1).then(() => {
			store.dispatch({ type: "SelectGameMode", gameMode: this._conclude() as keyof typeof gameModes });
			store.dispatch({ type: "StopVote" });
			this.councilStopVote.SendToAllPlayers();
		});
	}

	protected _conclude() {
		const state = store.getState();
		return getVoteOrDefault(state.votes, state.topic.options);
	}

	protected _serializeTopic(topic: TopicFormat) {
		return {
			name: topic.name,
			options: topic.options.asPtr(),
		};
	}

	protected _castVote(player: Player, vote: string) {
		store.dispatch({ type: "CastVote", player: player, vote: vote });
	}
}
