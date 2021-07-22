import { OnInit, Service } from "@rbxts/flamework";
import Remotes from "shared/Remotes";
import store from "server/core/rodux/store";
const userRequestDeploy = Remotes.Server.Create("userRequestDeploy");

@Service({ loadOrder: 5 })
export class Deployment implements OnInit {
	onInit() {
		userRequestDeploy.SetCallback((player) => {
			const state = store.getState();
			if (state.sequence === "started") {
				store.dispatch({ type: "Deploy", player: player });
				if (player.Character) {
					return player.Character;
				}
			}

			return false;
		});
	}
}
