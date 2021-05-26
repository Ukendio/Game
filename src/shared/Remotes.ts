import Net from "@rbxts/net";
import NetDefinitions from "@rbxts/net/out/definitions";

const remotes = Net.Definitions.Create({
	ServerCreateHealthPack: Net.Definitions.ServerToClientEvent<[Model]>(),

	ClientRequestDeploy: NetDefinitions.ClientToServerEvent(),
});

export default remotes;
