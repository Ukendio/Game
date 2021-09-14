import { OnInit, Service } from "@flamework/core";
import Remotes from "shared/Remotes";
import store from "server/core/rodux/store";
import Log from "@rbxts/log";
import { Sequence } from "shared/Types";
const userRequestDeploy = Remotes.Server.Create("userRequestDeploy");

@Service({ loadOrder: 5 })
export class Deployment implements OnInit {
	onInit() {
		userRequestDeploy.Connect((player) => {
			if (store.getState().round.sequence === Sequence.Started) {
				return store
					.getState()
					.dispatcher.deployedPlayers.iter()
					.find((current) => current === player)
					.match(
						(player) => {
							Log.Warn("{} has already been deployed", player.Name);
						},
						() => {
							store.dispatch({ type: "Deploy", player });
						},
					);
			}
		});
	}
}
