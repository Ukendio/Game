import { ReplicatedStorage, Workspace } from "@rbxts/services";

export function loadMap(mapName: string) {
	let map = Workspace.FindFirstChild(mapName) as Model;
	if (!map) {
		map = ReplicatedStorage.TS.Architect.maps.FindFirstChild(mapName)!.Clone() as Model;
		map.Parent = Workspace;
	}
	return map;
}
