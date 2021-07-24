import { Option, Result } from "@rbxts/rust-classes";
import { Config, Mode } from "shared/Types";

const weaponsTable: Record<string, Config> = {
	AK47: {
		fireRate: 1,
		recoil: 1,
		maxDistance: 100,
		mode: Mode.Auto,
		damage: 1,
	},
	M16: {
		fireRate: 1,
		recoil: 1,
		maxDistance: 100,
		mode: Mode.Semi,
		damage: 5,
	},
};

export const getWeaponSettings = (weaponName: keyof typeof weaponsTable): Result<Option<Config>, string> => {
	const weaponSettings = weaponsTable[weaponName];

	if (weaponSettings) return Result.ok(Option.some(weaponSettings));

	return Result.err("Unknown weaponName");
};
