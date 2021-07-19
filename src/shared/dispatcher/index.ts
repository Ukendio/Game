import Log from "@rbxts/log";
import { noYield } from "./noYield";
import SingleEvent from "./singleEvent";

interface Listener {
	handler: Callback;
	disconnected: boolean;
	connectTraceback: string;
	disconnectTraceback: string;
	next: Listener;
}

export function interval(duration: number, callback: Callback) {
	const event = new SingleEvent((dispatch) => (_listener, _promise, isCancelled) => {
		let loop: Callback = async () => {
			return Promise.try(dispatch)
				.andThenCall(Promise.delay, duration)
				.then(() => {
					if (
						!isCancelled(() => {
							Log.Warn("[Event] Rejected");
							loop = undefined!;
						})
					) {
						return loop();
					}
				});
		};

		loop();
	});

	return {
		event: event,
		callback: callback,
	};
}

const tracebackReporter = (message: unknown) => debug.traceback(tostring(message));

export { noYield } from "./noYield";

export default class Dispatcher {
	private currentListHead = undefined! as Listener;

	connect(handler: Callback) {
		const listener: Listener = {
			handler: handler,
			disconnected: false,
			connectTraceback: debug.traceback(),
			disconnectTraceback: undefined!,
			next: this.currentListHead,
		};

		const disconnect = () => {
			if (listener.disconnected) {
				throw `Listener connected at: \n${listener.connectTraceback}\nwas already disconnected at listener.disconnectTraceback`;
			}

			listener.disconnected = true;
			listener.disconnectTraceback = debug.traceback();

			if (this.currentListHead === listener) {
				this.currentListHead = listener.next;
			} else {
				let previous = this.currentListHead;

				while (previous && previous.next !== listener) {
					previous = previous.next;
				}

				if (previous) {
					previous.next = listener.next;
				}
			}
		};

		this.currentListHead = listener;

		return {
			/**
			 * @hidden
			 * We don't want to expose the listener property
			 */
			listener: listener,
			disconnect: disconnect,
		};
	}

	/**
	 * @hidden
	 * we declare this field so that promise can consume it in promise::fromEvent
	 */
	Connect(...args: Parameters<Dispatcher["connect"]>) {
		return this.connect(...args);
	}

	fire(...args: unknown[]) {
		let listener = this.currentListHead;

		while (listener !== undefined) {
			if (!listener.disconnected) {
				listener.handler(...args);
			}
			listener = listener.next;
		}
	}

	fireNoYield(...args: unknown[]) {
		let listener = this.currentListHead;

		while (listener !== undefined) {
			if (!listener.disconnected) {
				const [ok, result] = xpcall(() => {
					noYield(listener.handler, ...args);
				}, tracebackReporter);

				if (!ok) throw result;
			}
			listener = listener.next;
		}
	}
}
