import { OnInit, Service } from "@rbxts/flamework";
import { Players } from "@rbxts/services";
import { Events } from "shared/remotes";

const events = Events.server;

@Service({})
export class Referee implements OnInit {
	onInit() {
		Players.PlayerRemoving.Connect((player) => {
			events.updateScoreBoard.except(player, player.Name);
		});
	}
}
