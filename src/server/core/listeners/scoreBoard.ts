import { Players } from "@rbxts/services";
import Remotes from "shared/remotes";

const UIScoreboardUpdate = Remotes.Server.Create("UIScoreboardUpdate");

Players.PlayerRemoving.Connect((player) => {
	UIScoreboardUpdate.SendToAllPlayersExcept(player, player.Name);
});
