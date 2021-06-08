/// <reference types="@rbxts/testez/globals" />
import Dispatcher, { interval, noYield } from "shared/dispatcher";

function now() {
	return DateTime.now().UnixTimestampMillis / 1000;
}
export = () => {
	describe("interval", () => {
		it("Should not run", () => {
			let hasRan = false;
			const listener = interval(1, (message: string) => {
				hasRan = true;
			});
			const connection = listener.event.connect(() => {
				listener.callback("hello"); // won't be ran
			});
			connection.disconnect();
			Promise.delay(1.2).await();
			expect(hasRan).to.equal(false);
		});

		it("Should fire every interval", () => {
			Promise.delay(2.5).await(); // yield til after player loaded
			let testValue = 0;
			const times = new Array<number>();
			const listener = interval(1 / 6, () => {
				testValue += 1;
				times.push(now());
			});
			const connection = listener.event.connect(() => {
				listener.callback();
			});

			Promise.delay(5.2 / 6).await();
			connection.disconnect();

			expect(math.abs(testValue - 5) <= 1).to.equal(true);
		});
	});

	describe("Signal", () => {
		it("Should only run once", () => {
			const signal = new Dispatcher();
			let hasRanTimes = 0;
			const connection = signal.connect((check) => {
				connection.disconnect();
				hasRanTimes = check;
			});
			signal.fire(1);
			signal.fire(2); // This should not connect

			expect(hasRanTimes).to.equal(1);
		});

		it("Inline resumption should be of okay", () => {
			const signal = new Dispatcher();
			let success = false;
			signal.connect(() => {
				success = true;
			});

			signal.fire();
			expect(success).to.equal(true);
		});

		it("Error when yielding inside of handler", () => {
			const signal = new Dispatcher();

			signal.connect(() => {
				wait(5);
			});

			const tracebackReporter = (message: unknown) => debug.traceback(tostring(message));

			const [ok, result] = xpcall(() => {
				noYield(() => {
					signal.fire();
				});
			}, tracebackReporter);

			//if (!ok) warn(result); silence the warn
			expect(ok).to.equal(false);
		});
	});
};
