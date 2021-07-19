import { InferDataType } from "@rbxts/fabric";
import { Vec } from "@rbxts/rust-classes";

export enum Mode {
	Semi,
	Auto,
}

export interface Config {
	fireRate: number;
	recoil: number;
	maxDistance: number;
	mode: Mode;
	damage: number;
}

export interface TopicFormat {
	name: string;
	options: Vec<string>;
}

export interface PlayerTeam {
	tag: Team;
	kills: number;
	deaths: number;
	members: Vec<Player>;
}

export interface PlayerScore {
	player: Player;
	kills: number;
	deaths: number;
}

export type TLayerData<T extends keyof FabricUnits> = Required<FabricUnits[T]>["_addLayerData"] extends {}
	? Required<FabricUnits[T]>["_addLayerData"]
	: Partial<InferDataType<T>>;
