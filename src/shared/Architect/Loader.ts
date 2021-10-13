import { Option, Result } from "@rbxts/rust-classes";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { EvaluateInstanceTree, validateTree } from "@rbxts/validate-tree";

const ModelWithSpawns = {
	$className: "Model",
	Spawns: "Folder",
} as const;
type ModelWithSpawns = EvaluateInstanceTree<typeof ModelWithSpawns>;

export function load_map(map_name: string): Result<Option<ModelWithSpawns>, string> {
	const maps_folder = Workspace.FindFirstChild("Maps")! as Folder;
	if (maps_folder.GetChildren()[0]) return Result.err("A map already exists");

	const selected_map = ReplicatedStorage.TS.Architect.maps.FindFirstChild(map_name);
	if (!selected_map) return Result.err(`Could not find a model by the name of ${map_name}`);
	if (!validateTree(selected_map, ModelWithSpawns))
		return Result.err(`Found map model ${map_name}, but tree didn't match`);
	selected_map.Parent = maps_folder;
	return Result.ok(Option.some(selected_map));
}
