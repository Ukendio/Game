import { OnStart, Service } from "@rbxts/flamework";
import store from "server/core/rodux/store";
import { Election } from "../election";
import remotes from "shared/Remotes";
import Log from "@rbxts/log";

const roundStarted = remotes.Server.Create("roundStarted");

@Service({
	loadOrder: 2,
})
export class RoundCoordinator implements OnStart {
	constructor(private Election: Election) {}

	onStart() {
		const roundBuilder = async () => {
			store.dispatch({ type: "StartRound" });
			roundStarted.SendToAllPlayers();

			Log.Info("round started");

			return store
				.getState()
				.winCondition(store)
				.andThenCall(Promise.delay, 5)
				.then(() => {
					Log.Info("prompt");
				});
		};

		const intermission = () => {
			Log.Info("intermission");

			return Promise.delay(15)
				.then(() => this.Election.voteOn("Map"))
				.then(() => this.Election.voteOn("GameMode"))
				.then(() => roundBuilder())
				.expect();
		};

		while (true) {
			intermission();
		}
	}
}
