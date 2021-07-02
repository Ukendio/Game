import { OnStart, Service } from "@rbxts/flamework";
import store from "shared/Rodux/store";
import { startRound } from "shared/Rodux/actions";
import { Election } from "../election";
import remotes from "shared/Remotes";

const roundStarted = remotes.Server.Create("roundStarted");

@Service({
	loadOrder: 1,
})
export class RoundCoordinator implements OnStart {
	constructor(private Election: Election) {}

	onStart() {
		const roundBuilder = async () => {
			print("round started");
			store.dispatch(startRound());
			roundStarted.SendToAllPlayers();
			return store
				.getState()
				.winCondition(store)
				.andThenCall(Promise.delay, 5)
				.then(() => {
					//prompt MVP
					print("prompt");
				});
		};
		const intermission = () => {
			print("intermission");
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
