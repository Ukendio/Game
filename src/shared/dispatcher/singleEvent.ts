class SingleEvent {
	private _listener = undefined! as Callback;
	private _promise = undefined! as Promise<unknown>;

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
			if (this._listener !== undefined) {
				coroutine.wrap(this._listener)();
			}
		};
		this._promise = Promise.defer((resolve) => {
			resolve(new Promise(executor(dispatch)).then(() => (this._listener = undefined!)));
		});
	}

	connect(handler: Callback) {
		assert(this._listener === undefined, "Dispatcher is already used up");
		assert(this._promise.getStatus() === "Started", "Dispatcher is already used up");

		this._listener = handler;
		const disconnect = () => {
			this._promise.cancel();
			this._listener = undefined!;
		};

		return {
			disconnect: disconnect,
		};
	}
}

export = SingleEvent;
