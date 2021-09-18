import { Option, Result } from "@rbxts/rust-classes";
import { ReplicatedStorage, Workspace } from "@rbxts/services";

interface ModelWithSpawns extends Model {
	Spawns: Folder;
}

export function load_map(map_name: string): Result<Option<ModelWithSpawns>, string> {
	const maps_folder = Workspace.FindFirstChild("Maps")! as Folder;
	if (next(maps_folder.GetChildren())[0] !== undefined) return Result.err("A map already exists");

	const selected_map = ReplicatedStorage.TS.Architect.maps.FindFirstChild(map_name) as ModelWithSpawns;
	if (selected_map === undefined) return Result.err(`Could not find a model by the name of ${map_name}`);

	selected_map.Parent = maps_folder;
	return Result.ok(Option.some(selected_map));
}
