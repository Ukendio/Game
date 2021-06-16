import { Option } from "@rbxts/rust-classes";
import { ReplicatedStorage, Workspace } from "@rbxts/services";

export function loadMapOption(mapName: string) {
	return Option.wrap(Workspace.FindFirstChild(mapName) as Model).unwrapOrElse(() => {
		const map = ReplicatedStorage.TS.Architect.maps.FindFirstChild(mapName) as Model;
		map.Parent = Workspace;
		return map;
	});
}
