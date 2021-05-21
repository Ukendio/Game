interface StarterPlayer extends Instance {
	StarterPlayerScripts: Instance & {
		TS: Folder & {
			units: Folder;
		};
	};
}
