import Net from "@rbxts/net";

const remotes = Net.Definitions.Create({
	ServerCreateHealthPack: Net.Definitions.ServerToClientEvent<[Model]>(),
});

export default remotes;
