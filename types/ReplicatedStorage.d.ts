interface ReplicatedStorage extends Instance {
	assets: Folder & {
		Heal: Model;
		Pistol: Tool;
		HealingSound: Sound;
		PistolShot: Sound;
		Knife: Tool;
	};
	TS: Folder & {
		Architect: Folder & {
			maps: Folder;
		};
	};

	tests: Folder;
}
