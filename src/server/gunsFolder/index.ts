import { Option, Result } from "@rbxts/rust-classes";
import { Config, Mode } from "shared/Types";

type WeaponsTable = "AK47" | "M16";

export const weaponsTable: Record<WeaponsTable, Config> = {
	AK47: identity<Config>({
		fireRate: 1,
		recoil: 1,
		maxDistance: 100,
		mode: Mode.Semi,
		damage: 1,
	}),
	M16: identity<Config>({
		fireRate: 1,
		recoil: 1,
		maxDistance: 100,
		mode: Mode.Semi,
		damage: 1,
	}),
};

export const getWeaponSettings = (weaponName: WeaponsTable): Option<Config> => {
	return Option.wrap(weaponsTable[weaponName]);
};
