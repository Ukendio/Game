import Rodux from "@rbxts/rodux";
import { PlayerScore } from "server/core/Competitor/reducer";

export interface AddPlayerToBoardAction extends Rodux.Action<"AddPlayerToBoard"> {
	playerScore: PlayerScore;
}

export function addPlayerToBoard(playerScore: PlayerScore): AddPlayerToBoardAction {
	return {
		type: "AddPlayerToBoard",
		playerScore: playerScore,
	};
}

export interface ChangeRankingAction extends Rodux.Action<"ChangeRanking"> {}

export function changeRanking(): ChangeRankingAction {
	return {
		type: "ChangeRanking",
	};
}
