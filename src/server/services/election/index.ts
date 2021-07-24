import { OnInit, Service } from "@rbxts/flamework";
import { Vec } from "@rbxts/rust-classes";
import { gameModes } from "server/gameModes";
import store from "server/core/rodux/store";
import { getVoteOrDefault } from "./getVoteOrDefault";
import remotes from "shared/Remotes";
import Object from "@rbxts/object-utils";
import Log from "@rbxts/log";

const serverEvents = remotes.Server;

@Service({
	loadOrder: 5,
})
export class Election implements OnInit {
	private clientAppendVote = serverEvents.Create("clientAppendVote");
	private councilVoteOn = serverEvents.Create("councilVoteOn");
	private councilStopVote = serverEvents.Create("councilStopVote");

	constructor() {}

	onInit() {
		//TODO: sanitize event
		this.clientAppendVote.Connect((player, vote) => {
			store.dispatch({ type: "CastVote", player: player, vote: vote });
			Log.Info("{} has voted on {}", player, vote);
		});
	}

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
		this.councilVoteOn.SendToAllPlayers({ name: topic, options: store.getState().topic.options.asPtr() });

		return Promise.delay(1).then(() => {
			const currentState = store.getState();
			store.dispatch({
				type: "SelectGameMode",
				gameMode: getVoteOrDefault(currentState.votes, currentState.topic.options).expect(
					"Unexpected error",
				) as keyof typeof gameModes,
			});
			store.dispatch({ type: "StopVote" });
			this.councilStopVote.SendToAllPlayers();
		});
	}
}
