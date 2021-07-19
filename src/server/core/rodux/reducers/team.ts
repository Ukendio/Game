import Rodux from "@rbxts/rodux";
import { Vec } from "@rbxts/rust-classes";
import { PlayerTeam } from "shared/Types";

export interface TeamState {
	teams: Vec<PlayerTeam>;
}

export type TeamActions =
	| {
			type: "AddTeammate";
			player: Player;
			team: PlayerTeam;
	  }
	| {
			type: "RemoveTeammate";
			player: Player;
			team: PlayerTeam;
	  }
	| {
			type: "AddKillToTeam";
			team: PlayerTeam;
	  }
	| {
			type: "AddDeathToTeam";
			team: PlayerTeam;
	  }
	| {
			type: "EnlistTeam";
			team: PlayerTeam;
	  };

export const initialState = {
	teams: Vec.vec<PlayerTeam>(),
};

export const teamReducer = Rodux.createReducer<TeamState, TeamActions>(initialState, {
	AddTeammate: (state, action) => {
		action.team.members.push(action.player);
		return { ...state };
	},

	RemoveTeammate: (state, action) => {
		action.team.members.iter().filter((current) => current !== action.player);
		return { ...state };
	},

	AddKillToTeam: (state, action) => {
		const newState = { ...state };
		newState.teams
			.iter()
			.find((team) => team === action.team)
			.map((playerTeam) => playerTeam.kills++);

		return newState;
	},

	AddDeathToTeam: (state, action) => {
		action.team.deaths++;
		return { ...state };
	},
	EnlistTeam: (state, action) => {
		return { ...state, teams: Vec.vec(...[action.team, ...state.teams.asPtr()]) };
	},
});
