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
		it("Should not run", () => {
			const signal = new Dispatcher();
			const connection = signal.connect((check) => {
				expect(check).to.be.never;
			});
			connection.disconnect();
			signal.fire(1);
		});
	});
};
