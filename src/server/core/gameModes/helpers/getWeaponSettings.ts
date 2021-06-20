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
} as const;

export const getWeaponSettings = (weaponName: keyof typeof weaponsTable) => weaponsTable[weaponName];
