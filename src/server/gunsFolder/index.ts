import { ConfigurableSettings, Mode } from "shared/Types";

export const weaponsFolder = {
	ak47_settings: identity<ConfigurableSettings>({
		fireRate: 1,
		recoil: 1,
		maxDistance: 100,
		mode: Mode.Semi,
		damage: 1,
	}),

	m16_settings: identity<ConfigurableSettings>({
		fireRate: 1,
		recoil: 2,
		maxDistance: 100,
		mode: Mode.Semi,
		damage: 1,
	}),
};
