interface ReplicatedStorage extends Instance {
	TS: Folder & {
		assets: Folder & {
			Heal: Model;
		};
		tests: Folder;
	};
}
