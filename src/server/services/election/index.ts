import { OnInit, OnStart, Service } from "@rbxts/flamework";
import { Vec } from "@rbxts/rust-classes";
import { gameModes } from "server/core/gameModes";
import store from "server/core/store";
import { castVote, createTopic, selectGameMode, startVote, stopVote } from "server/core/store/actions";
import { match } from "shared/rbxts-pattern";
import { serverEvents } from "shared/remotes";
import { getKeys } from "shared/tableUtil";
import { getVoteOrDefault } from "./getVoteOrDefault";

@Service({
	loadOrder: 4,
})
export class Election implements OnInit, OnStart {
	constructor() {}

	onInit() {
		serverEvents.connect("clientAppendVote", (player, vote) => {
			const state = store.getState();

			assert(state.voting === false, "Cannot start a vote when a vote is ongoing");
			assert(
				state.topic.options.iter().find((option) => option === vote),
				"Was not found in votable options",
			);

			store.dispatch(castVote(player, vote));
		});

		serverEvents.connect("clientAppendVote", (player, vote) => this._castVote(player, vote));
	}

	onStart() {}

	voteOn(topic: string) {
		return match(topic)
			.with("GameMode", async () => {
				store.dispatch(
					createTopic({
						name: "Gamemode",
						options: Vec.vec(...getKeys(gameModes)),
					}),
				);

				store.dispatch(startVote());

				serverEvents.councilVoteOn.broadcast(this._serializeTopic());

				await Promise.delay(1).then(() => {
					store.dispatch(selectGameMode(this._conclude() as keyof typeof gameModes));
					store.dispatch(stopVote());

					serverEvents.councilStopVote.broadcast();
				});
			})
			.with("Map", async () => {
				store.dispatch(
					createTopic({
						name: "Gamemode",
						options: Vec.vec(...getKeys(gameModes)),
					}),
				);

				store.dispatch(startVote());

				serverEvents.councilVoteOn.broadcast(this._serializeTopic());

				await Promise.delay(1).then(() => {
					store.dispatch(selectGameMode(this._conclude() as keyof typeof gameModes));
					store.dispatch(stopVote());

					serverEvents.councilStopVote.broadcast();
				});
			});
	}

	protected _conclude() {
		const state = store.getState();
		return getVoteOrDefault(state.votes, state.topic.options);
	}

	protected _serializeTopic() {
		const topic = store.getState().topic;
		return {
			name: topic.name,
			options: topic.options.asPtr(),
		};
	}

	protected _castVote(player: Player, vote: string) {
		store.dispatch(castVote(player, vote));
	}
}
