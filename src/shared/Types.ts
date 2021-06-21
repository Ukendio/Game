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

export type TLayerData<T extends keyof FabricUnits> = Required<FabricUnits[T]>["_addLayerData"] extends {}
	? Required<FabricUnits[T]>["_addLayerData"]
	: Partial<InferDataType<T>>;
