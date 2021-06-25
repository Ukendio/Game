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
	],

	maps: ["Warehouse"],
});
