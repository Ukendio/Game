import { Settings } from "../types";

export = identity<Settings>({
	//13:40 minutes in seconds
	roundLength: 5, //13 * 60 + 40
	maxKills: 32,

	teams: [
		new BrickColor("Dark blue"),
		new BrickColor("Really red"),
		new BrickColor("Bright yellow"),
		new BrickColor("Hot pink"),

		new BrickColor("Royal purple"),
		new BrickColor("Sage green"),
		new BrickColor("Teal"),
		new BrickColor("Warm yellowish orange"),

		new BrickColor("Turquoise"),
		new BrickColor("Mid gray"),
		new BrickColor("Medium Royal blue"),
		new BrickColor("Light bluish green"),

		new BrickColor("Light purple"),
		new BrickColor("Lime green"),
		new BrickColor("Neon orange"),
		new BrickColor("Red flip/flop"),
	],

	maps: ["Warehouse"],
});
