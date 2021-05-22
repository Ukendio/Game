/// <reference types="@rbxts/testez/globals" />
import Dispatcher, { interval } from "shared/dispatcher";

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
	});
};
