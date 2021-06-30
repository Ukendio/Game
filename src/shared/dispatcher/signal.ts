import { noYield } from "./noYield";

interface Listener {
	handler: Callback;
	disconnected: boolean;
	connectTraceback: string;
	disconnectTraceback: string;
	next: Listener;
}

const tracebackReporter = (message: unknown) => debug.traceback(tostring(message));

class Signal {
	private _currentListHead = undefined! as Listener;

	connect(handler: Callback) {
		const listener: Listener = {
			handler: handler,
			disconnected: false,
			connectTraceback: debug.traceback(),
			disconnectTraceback: undefined!,
			next: this._currentListHead,
		};

		const disconnect = () => {
			if (listener.disconnected) {
				throw `Listener connected at: \n${listener.connectTraceback}\nwas already disconnected at listener.disconnectTraceback`;
			}

			listener.disconnected = true;
			listener.disconnectTraceback = debug.traceback();

			if (this._currentListHead === listener) {
				this._currentListHead = listener.next;
			} else {
				let previous = this._currentListHead;

				while (previous && previous.next !== listener) {
					previous = previous.next;
				}

				if (previous) {
					previous.next = listener.next;
				}
			}
		};

		this._currentListHead = listener;
		return {
			/**
			 * @hidden
			 * We don't want to expose the listener property
			 */
			listener: listener,
			disconnect: disconnect,
		};
	}

	fire(...args: unknown[]) {
		let listener = this._currentListHead;

		while (listener !== undefined) {
			if (!listener.disconnected) {
				const [ok, result] = pcall(() => {
					noYield(listener.handler, ...args);
				}); // TODO: add tracebackReporter with xpcall when @rbxts/types updates the xpcall definition

				if (!ok) throw result;
			}
			listener = listener.next;
		}
	}
}

export = Signal;
