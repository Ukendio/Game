function resultHandler(co: thread, ok: boolean, ...results: unknown[]) {
	if (!ok) {
		error(debug.traceback(co, ...(results as string[])), 2);
	}

	if (coroutine.status(co) !== "dead") {
		error(debug.traceback(co, "Attempted to yield inside changed event!"), 2);
	}

	return results as LuaTuple<[unknown, unknown]>;
}

export function noYield<T extends (...args: never[]) => unknown>(callback: T, ...args: Parameters<T>) {
	const co = coroutine.create(callback);

	return resultHandler(co, coroutine.resume(co, ...args) as never);
}
