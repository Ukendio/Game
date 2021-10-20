import { Option, Result } from "@rbxts/rust-classes";
import { Config, Mode } from "shared/Types";

const weaponsTable = identity<{ [index: string]: Config }>({
	AK47: {
		fire_rate: 1,
		recoil: 10,
		max_distance: 100,
		mode: Mode.Auto,
		damage: 1,
		weight: 1,
	},
	M16: {
		fire_rate: 1,
		recoil: 1,
		max_distance: 100,
		mode: Mode.Semi,
		damage: 5,
		weight: 1,
	},
});

export const getWeaponSettings = (weaponName: string): Option<Config> => Option.wrap(weaponsTable[weaponName]);
