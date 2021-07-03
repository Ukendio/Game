import { Service } from "@rbxts/flamework";
import store from "shared/Rodux/store";
import { addTeammate } from "shared/Rodux/actions";

@Service({
	loadOrder: 6,
})
export class Enlistment {
	constructor() {}
	join(player: Player) {
		const team = store
			.getState()
			.teams.iter()
			.maxBy((a, b) => a.members.len() - b.members.len())
			.unwrap();

		this._lock(team.tag);
		store.dispatch(addTeammate(player, team));
	}

	_ensureLocked() {}

	_lock(team: Team) {}

	_unlock(team: Team) {}
}
