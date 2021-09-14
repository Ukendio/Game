import { Result, UnitType } from "@rbxts/rust-classes";
import { ReplicatedStorage, Workspace } from "@rbxts/services";

export function load_map(map_name: string): Result<UnitType, string> {
	const maps_folder = Workspace.FindFirstChild("Maps")! as Folder;
	if (next(maps_folder.GetChildren())[0] !== undefined) return Result.err("A map already exists");

	const selected_map = ReplicatedStorage.TS.Architect.maps.FindFirstChild(map_name) as Model;
	if (selected_map === undefined) return Result.err(`Could not find a model by the name of ${map_name}`);

	selected_map.Parent = maps_folder;
	return Result.ok({});
}
