import { OnInit, Service } from "@rbxts/flamework";
import { Players } from "@rbxts/services";
import { serverEvents } from "shared/remotes";

@Service({})
export class Referee implements OnInit {
	onInit() {
		Players.PlayerRemoving.Connect((player) => {
			serverEvents.updateScoreBoard.except(player, player.Name);
		});
	}
}
