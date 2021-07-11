class SingleEvent {
	private listener: Callback | undefined;
	private promise = undefined! as Promise<unknown>;

	constructor(
		executor: (
			dispatch: Callback,
		) => (
			resolve: (value: unknown) => void,
			reject: (reason?: unknown) => void,
			onCancel: (abortHandler: () => void) => boolean,
		) => void,
	) {
		const dispatch = () => {
			if (this.listener !== undefined) {
				coroutine.wrap(this.listener)();
			}
		};
		this.promise = Promise.defer((resolve) => {
			resolve(new Promise(executor(dispatch)).then(() => (this.listener = undefined)));
		});
	}

	connect(handler: Callback) {
		assert(this.listener === undefined, "Dispatcher is already used up");
		assert(this.promise.getStatus() === "Started", "Dispatcher is already used up");

		this.listener = handler;
		const disconnect = () => {
			this.promise.cancel();
			this.listener = undefined!;
		};

		return {
			disconnect: disconnect,
		};
	}
}

export = SingleEvent;
