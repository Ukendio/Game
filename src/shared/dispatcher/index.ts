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
/* Unstable
export function spreadInterval(duration: number, callbackCreator: () => Callback) {
	let isReady = true;
	let needsRestart = false;

	let loop: Callback;
	const event = new SingleEvent((dispatch) => (_listener, _promise, isCancelled) => {
		loop = async () => {
			return Promise.try(dispatch)
				.andThenCall(Promise.delay, duration)
				.then(() => {
					if (
						!isCancelled(() => {
							warn("[Event] Rejected");
							loop = undefined!;
						})
					) {
						return loop();
					}
				});
		};

		loop();
	});

	function becomeReady() {
		isReady = true;

		if (needsRestart) {
			needsRestart = false;

			loop();
		}
	}

	return {
		event: event,
		callback: (list: Array<object>) => {
			const callback = callbackCreator();

			const listCopy = [...list];
			let copyIndex = 0;
			let currentIndex = 0;
			let seen = 0;

			function stepIndex() {
				if (copyIndex <= listCopy.size() && listCopy[copyIndex] !== list[currentIndex]) {
					currentIndex = list.findIndex((current) => current === listCopy[copyIndex]) ?? currentIndex;
				}

				const value = list[currentIndex];
				currentIndex = math.min(list.size() + 1, currentIndex + 1);
				copyIndex = math.min(list.size(), copyIndex + 1);
				if (value) {
					seen += 1;
				}
				return value;
			}

			let currentTime = 0;

			while (currentTime <= duration) {
				const remainingTasks = list.size() - seen;
				const remainingTime = duration - currentTime;
				const timePerUpdate = remainingTime / remainingTasks;
				const updateToDoNow = math.ceil(dt / timePerUpdate);

				const promise = Promise.delay(timePerUpdate).then((timeTaken) => {
					currentTime += timeTaken;
				});

				for (let i = 0; i < updateToDoNow; i++) {
					const nextTask = stepIndex();
					if (nextTask) {
						const [ok, result] = coroutine.resume(coroutine.create(callback), nextTask);
						if (!ok) {
							warn(result);
						}
					}
				}
				promise.await();

				if (seen < list.size()) {
					for (let i = seen; i < list.size(); i++) {
						const [ok, result] = coroutine.resume(coroutine.create(callback), list[i]);
						if (!ok) {
							warn(result);
						}
					}
				}

				becomeReady();
			}
		},
	};
}
*/
export { noYield } from "./noYield";

export default Signal;
