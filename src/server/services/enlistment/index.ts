import { Service } from "@flamework/core";
import store from "server/core/rodux/store";

function lock(tag: Team) {}

@Service({
	loadOrder: 6,
})
export class Enlistment {
	join(player: Player) {
		const team = store
			.getState()
			.teams.iter()
			.maxBy((a, b) => a.members.len() - b.members.len())
			.unwrap();

		lock(team.tag);
		store.dispatch({ type: "AddTeammate", player: player, team: team });
	}
}
