import { Option } from "@rbxts/rust-classes";
import { Config, Mode } from "shared/Types";

type WeaponsTable = "AK47" | "M16";

const weaponsTable = new Map<WeaponsTable, Config>([
	[
		"AK47",
		{
			fireRate: 1,
			recoil: 1,
			maxDistance: 100,
			mode: Mode.Auto,
			damage: 1,
		},
	],
	[
		"M16",
		{
			fireRate: 1,
			recoil: 1,
			maxDistance: 100,
			mode: Mode.Semi,
			damage: 5,
		},
	],
]);

export const getWeaponSettings = (weaponName: WeaponsTable): Option<Config> => {
	return Option.wrap(weaponsTable.get(weaponName));
};
