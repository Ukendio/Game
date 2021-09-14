import { InferDataType } from "@rbxts/fabric";
import { Vec } from "@rbxts/rust-classes";

export enum GunSide {
	Right,
	Left,
}

export const enum Mode {
	Auto = "Auto",
	Burst = "Burst",
	Semi = "Semi",
}

export enum Sequence {
	Started,
	Intermission,
}

export interface Config {
	fire_rate: number;
	recoil: number;
	max_distance: number;
	mode: Mode;
	damage: number;
	weight: number;
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
