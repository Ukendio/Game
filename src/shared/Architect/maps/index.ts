import { ReplicatedStorage } from "@rbxts/services";

export const mapNames = new Array<string>();
ReplicatedStorage.TS.Architect.maps.GetChildren().forEach((current) => {
	mapNames.push(current.Name);
});
