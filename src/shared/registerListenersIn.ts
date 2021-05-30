function registerListener(object: ModuleScript) {
	require(object);
}

export function registerListenerIn(container: Instance) {
	for (const object of container.GetChildren()) {
		if (object.IsA("ModuleScript")) {
			registerListener(object);

			if (next(object.GetChildren()) !== undefined) {
				registerListenerIn(object);
			}
		} else registerListenerIn(object);
	}
}
