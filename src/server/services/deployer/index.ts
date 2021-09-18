import { OnInit, Service } from "@flamework/core";
import Remotes from "shared/Remotes";
import store from "server/core/rodux/store";
import Log from "@rbxts/log";
import { Sequence } from "shared/Types";
import { findSpawn } from "./findSpawn";
import { Workspace } from "@rbxts/services";
const userRequestDeploy = Remotes.Server.Create("userRequestDeploy");

@Service({ loadOrder: 5 })
export class Deployment implements OnInit {
	onInit() {
		userRequestDeploy.Connect((player) => {
			Log.Info("{} has requested to deploy", player);

			if (store.getState().round.sequence === Sequence.Started) {
				return store
					.getState()
					.dispatcher.deployedPlayers.iter()
					.find((current) => current === player)
					.match(
						(player) => {
							Log.Warn("{} has already been deployed", player.Name);
						},
						() => {
							store.dispatch({ type: "Deploy", player });

							findSpawn(store).map((a) => {
								player.RespawnLocation = a.expect("Could not find a spawn location");
								player.LoadCharacter();
								while (!player.Character?.IsDescendantOf(Workspace)) {
									player.Character?.AncestryChanged.Wait();
								}

								Log.Info("Player deployed");
							});
						},
					);
			}
		});
	}
}
