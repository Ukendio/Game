import { OnStart, Service } from "@flamework/core";
import store from "server/core/rodux/store";
import { Election } from "../election";
import remotes from "shared/Remotes";
import Log from "@rbxts/log";
import { Option, Vec } from "@rbxts/rust-classes";
import { mapNames } from "shared/Architect/maps";
import Object from "@rbxts/object-utils";
import { gamemodes } from "server/gamemodes";

const roundStarted = remotes.Server.Create("roundStarted");

@Service({
	loadOrder: 2,
})
export class RoundCoordinator implements OnStart {
	constructor(private Election: Election) {}

	onStart() {
		const roundBuilder = async () => {
			store.dispatch({ type: "start_round" });
			roundStarted.SendToAllPlayers();

			Log.Info("round started");

			const s = store.getState().election;

			return s.win_condition
				.expect(`Unable to get win condition from ${s.gamemode}`)(store)
				.andThenCall(Promise.delay, 5)
				.then(() => {
					Log.Info("prompt");
				});
		};

		const intermission = () => {
			Log.Info("intermission");

			return Promise.delay(15)
				.then(() => this.Election.voteOn({ name: "map", options: Vec.vec(...mapNames) }))
				.then(() => this.Election.voteOn({ name: "gamemode", options: Vec.vec(...Object.keys(gamemodes)) }))
				.andThenCall(roundBuilder)
				.expect();
		};

		while (true) {
			intermission();
		}
	}
}
