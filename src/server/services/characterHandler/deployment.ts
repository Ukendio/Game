import { OnInit, Service } from "@rbxts/flamework";
import Remotes from "shared/remotes";
import store from "server/core/store";
import { deploy } from "shared/Rodux/actions";
const userRequestDeploy = Remotes.Server.Create("userRequestDeploy");

@Service({ loadOrder: 5 })
export class Deployment implements OnInit {
	onInit() {
		userRequestDeploy.SetCallback((player) => {
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
