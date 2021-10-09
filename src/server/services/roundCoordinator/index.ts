import { OnStart, Service } from "@flamework/core";
import store from "server/core/rodux/store";
import { Election } from "../election";
import remotes from "shared/Remotes";
import Log from "@rbxts/log";
import { Vec } from "@rbxts/rust-classes";
import { mapNames } from "shared/Architect/maps";
import Object from "@rbxts/object-utils";
import { gamemodes } from "server/gamemodes";
import { load_map } from "shared/Architect/Loader";

const round_started = remotes.Server.Create("round_started");

@Service({
	loadOrder: 3,
})
export class RoundCoordinator implements OnStart {
	constructor(private Election: Election) {}

	onStart() {
		const roundBuilder = async () => {
			store.dispatch({ type: "start_round" });
			round_started.SendToAllPlayers();

			Log.Info("round started");

			return store
				.getState()
				.election.win_condition.expect(
					`Unable to get win condition from ${store.getState().election.gamemode}`,
				)(store)
				.andThenCall(Promise.delay, 5)
				.then(() => {
					Log.Info("prompt");
				});
		};

		const intermission = () => {
			Log.Info("intermission");

			return Promise.delay(0.5)
				.then(() => this.Election.voteOn({ name: "map", options: Vec.vec(...mapNames) }))
				.then(() => {
					load_map(store.getState().election.current_map.unwrap()).match((current_map) => {
						store.dispatch({
							type: "set_spawn_locations",
							positions: Vec.fromPtr(current_map.unwrap().Spawns.GetChildren() as Array<SpawnLocation>),
						});
					}, Log.Error);
				})
				.then(() => this.Election.voteOn({ name: "gamemode", options: Vec.vec(...Object.keys(gamemodes)) }))
				.andThenCall(roundBuilder)
				.expect();
		};

		while (true) {
			intermission();
		}
	}
}
