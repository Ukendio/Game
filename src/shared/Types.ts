export enum Mode {
	Semi,
	Auto,
}

export interface ConfigurableSettings {
	fireRate: number;
	recoil: number;
	maxDistance: number;
	mode: Mode;
	damage: number;
}

export interface TopicFormat {
	name: string;
	options: string[];
}
