import Remotes from "shared/remotes";
import store from "server/core/store";
import { respawnPlayer } from "./unitConstructor";
import { deploy } from "server/core/store/actions";
const ClientRequestDeploy = Remotes.Server.Create("ClientRequestDeploy");

ClientRequestDeploy.SetCallback((player) => {
	const state = store.getState();
	if (state.sequence === "started") {
		if (state.deployedPlayers.find((val) => val === player)) return false;

		store.dispatch(deploy(player));
		if (player.Character) {
			respawnPlayer(player);
			return player.Character;
		}
	}

	return false;
});
