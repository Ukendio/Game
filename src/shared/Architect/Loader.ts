import { ReplicatedStorage, Workspace } from "@rbxts/services";

export function mapLoadAsync(mapName: string) {
	const map = ReplicatedStorage.TS.Architect.maps.FindFirstChild(mapName) as Model;
	map.Parent = Workspace;
}
