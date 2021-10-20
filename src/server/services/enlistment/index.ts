import { Service } from "@flamework/core";
import store from "server/core/rodux/store";

function lock(tag: Team): void {
	print(tag);
}

@Service({
	loadOrder: 6,
})
export class Enlistment {
	public join(player: Player): void {
		const team = store
			.getState()
			.team.teams.iter()
			.maxBy((a, b) => a.members.len() - b.members.len())
			.unwrap();

		lock(team.tag);
		store.dispatch({ type: "AddTeammate", player: player, team: team });
	}
}
