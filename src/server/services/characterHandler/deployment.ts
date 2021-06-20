import { OnInit, Service } from "@rbxts/flamework";
import Remotes from "shared/remotes";
import store from "server/core/store";
import { deploy } from "server/core/store/actions";
const ClientRequestDeploy = Remotes.Server.Create("ClientRequestDeploy");

@Service({ loadOrder: 5 })
export class Deployment implements OnInit {
	onInit() {
		ClientRequestDeploy.SetCallback((player) => {
			const state = store.getState();
			if (state.sequence === "started") {
				store.dispatch(deploy(player));
				if (player.Character) {
					return player.Character;
				}
			}

			return false;
		});
	}
}
