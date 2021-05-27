import { ServerStorage, Workspace } from "@rbxts/services";

export function mapLoadAsync(mapName: string) {
	return new Promise<void>((resolve, reject) => {
		const map = ServerStorage.FindFirstChild("Maps")!.FindFirstChild(mapName) as Model;
		if (map) {
			map.Parent = Workspace;
			resolve();
		} else {
			reject(mapName);
		}
	});
}
