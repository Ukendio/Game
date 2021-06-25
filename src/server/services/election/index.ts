import { OnInit, OnStart, Service } from "@rbxts/flamework";
import { Vec } from "@rbxts/rust-classes";
import { gameModes } from "shared/gameModes";
import store from "server/core/store";
import { castVote, createTopic, selectGameMode, startVote, stopVote } from "shared/Rodux/actions";
import { match } from "shared/rbxts-pattern";
import { getVoteOrDefault } from "./getVoteOrDefault";
import remotes from "shared/Remotes";
import { TopicFormat } from "shared/Types";
import Object from "@rbxts/object-utils";

const serverEvents = remotes.Server;

@Service({
	loadOrder: 4,
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

	voteOn(topic: string) {
		return match(topic)
			.with("GameMode", async () => {
				store.dispatch(
					createTopic({
						name: "Gamemode",
						options: Vec.vec(...Object.keys(gameModes)),
					}),
				);

				store.dispatch(startVote());
				this.councilVoteOn.SendToAllPlayers(this._serializeTopic(store.getState().topic));

				await Promise.delay(1).then(() => {
					store.dispatch(selectGameMode(this._conclude() as keyof typeof gameModes));
					store.dispatch(stopVote());

					this.councilStopVote.SendToAllPlayers();
				});
			})
			.with("Map", async () => {
				store.dispatch(
					createTopic({
						name: "Map",
						options: Vec.vec(...Object.keys(gameModes)),
					}),
				);

				store.dispatch(startVote());

				this.councilVoteOn.SendToAllPlayers(this._serializeTopic(store.getState().topic));

				await Promise.delay(1).then(() => {
					store.dispatch(selectGameMode(this._conclude() as keyof typeof gameModes));
					store.dispatch(stopVote());

					this.councilStopVote.SendToAllPlayers();
				});
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
		store.dispatch(castVote(player, vote));
	}
}
