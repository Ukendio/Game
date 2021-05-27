interface ReplicatedStorage extends Instance {
	TS: Folder & {
		assets: Folder & {
			Heal: Model;
			Pistol: Tool;
			HealingSound: Sound;
			PistolShot: Sound;
		};
		tests: Folder;
		Architect: Folder & {
			maps: Folder;
		};
	};
}
