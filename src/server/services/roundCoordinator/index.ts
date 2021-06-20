import { OnStart, Service } from "@rbxts/flamework";
import store from "server/core/store";
import { startRound } from "server/core/store/actions";
import { Events } from "shared/remotes";
import { Election } from "../election";

const events = Events.server;

@Service({
	loadOrder: 3,
})
export class RoundCoordinator implements OnStart {
	constructor(private Election: Election) {}

	onStart() {
		const roundBuilder = async () => {
			store.dispatch(startRound());
			events.roundStarted.broadcast();

			return store
				.getState()
				.winCondition(store)
				.andThenCall(Promise.delay, 5)
				.then(() => {
					//prompt MVP
					print("prompt");
				})
				.then(() => intermission);
		};
		const intermission = () => {
			return Promise.delay(5)
				.then(() => this.Election.voteOn("Map"))
				.then(() => this.Election.voteOn("GameMode"))
				.then(() => roundBuilder)
				.expect();
		};

		while (true) {
			intermission();
		}
	}
}
