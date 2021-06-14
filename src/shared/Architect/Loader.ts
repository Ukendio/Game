import { ReplicatedStorage, Workspace } from "@rbxts/services";

export function mapLoadAsync(mapName: string) {
	let map = Workspace.FindFirstChild(mapName) as Model;
	if (map === undefined) {
		map = ReplicatedStorage.TS.Architect.maps.FindFirstChild(mapName) as Model;
		map.Parent = Workspace;
	}

	return map;
}
