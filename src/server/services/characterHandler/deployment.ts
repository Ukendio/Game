import { OnInit, Service } from "@rbxts/flamework";
import Remotes from "shared/Remotes";
import store from "server/core/rodux/store";
import Log from "@rbxts/log";
const userRequestDeploy = Remotes.Server.Create("userRequestDeploy");

@Service({ loadOrder: 5 })
export class Deployment implements OnInit {
	onInit() {
		userRequestDeploy.SetCallback((player) => {
			const state = store.getState();
			if (state.sequence === "started") {
				return state.deployedPlayers
					.iter()
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
