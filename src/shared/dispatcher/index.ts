import Log from "@rbxts/log";
import { RunService } from "@rbxts/services";
import Signal from "./signal";
import SingleEvent from "./singleEvent";

let dt: number = 1 / 60;

RunService.Heartbeat.Connect((step) => {
	dt = step;
});

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

export { noYield } from "./noYield";

export default Signal;
