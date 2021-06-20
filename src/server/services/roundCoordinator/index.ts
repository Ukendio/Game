import { OnStart, Service } from "@rbxts/flamework";
import store from "server/core/store";
import { startRound } from "server/core/store/actions";
import { Election } from "../election";
import remotes from "shared/Remotes";

const RoundStarted = remotes.Server.Create("RoundStarted");

@Service({
	loadOrder: 3,
})
export class RoundCoordinator implements OnStart {
	constructor(private Election: Election) {}

	onStart() {
		const roundBuilder = async () => {
			store.dispatch(startRound());
			RoundStarted.SendToAllPlayers();
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
