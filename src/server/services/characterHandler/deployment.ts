import { OnInit, Service } from "@flamework/core";
import Remotes from "shared/Remotes";
import store from "server/core/rodux/store";
import Log from "@rbxts/log";
const userRequestDeploy = Remotes.Server.Create("userRequestDeploy");

@Service({ loadOrder: 5 })
export class Deployment implements OnInit {
	onInit() {
		userRequestDeploy.SetCallback((player) => {
			if (store.getState().round.sequence === "started") {
				return store
					.getState()
					.dispatcher.deployedPlayers.iter()
					.find((current) => current === player)
					.match(
						(player) => {
							store.dispatch({ type: "Deploy", player: player });
							Log.Info("Deployed player: {}", player);

							return true;
						},
						() => {
							Log.Warn("Couldn't find player");
							return false;
						},
					);
			}

			return false;
		});
	}
}
