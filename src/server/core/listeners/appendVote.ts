import store from "../store";
import Remotes from "shared/remotes";
import { castVote } from "../store/actions";

const ClientAppendVote = Remotes.Server.Create("ClientAppendVote");

ClientAppendVote.Connect((player, vote) => {
	store.dispatch(castVote(player, vote));
});
