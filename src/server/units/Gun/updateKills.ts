import store from "server/core/store";
import { addKillToPlayer, addDeathToPlayer } from "server/core/store/actions";

function updateKills(player: Player, enemyPlayer: Player) {
	store.dispatch(addKillToPlayer(player));
	store.dispatch(addDeathToPlayer(enemyPlayer));
}

export = updateKills;
