/// <reference types="@rbxts/testez/globals" />
import { match, when, _select, __ } from "@rbxts/rbxts-pattern";

export = () => {
	describe("match number utility", () => {
		it("number is in set", () => {
			const number = 5;

			expect(
				match(number)
					.numberSet([1, 3, 5, 7, 11], (value) => `${value} is in array`)
					.with(__, (value) => `${value} is NOT in array`)
					.exhaustive(),
			).to.equal(`5 is in array`);
		});

		it("it is a Teen", () => {
			const number = 13;

			expect(
				match(number)
					.numberRange([13, 19], (value) => `${value} is a teen number`)
					.with(__, (value) => `${value} was not in set`)
					.exhaustive(),
			).to.equal("13 is a teen number");
		});

		it("2 is even", () => {
			const isOdd = (x: number) => x % 2 === 1;

			expect(
				match({ x: 2 })
					.with({ x: when(isOdd) }, ({ x }) => `${x} is odd`)
					.with(__, ({ x }) => `${x} is even`)
					.exhaustive(),
			).to.equal("2 is even");
		});

		it("is a prime number", () => {
			const isPrime = (n: number) => {
				if (n <= 1) return false;

				for (let i = 2; i < n; i++) {
					if (n % i === 0) return false;
				}

				return true;
			};

			expect(
				match({ x: 7 })
					.with({ x: when(isPrime) }, ({ x }) => `${x} is a prime number`)
					.with(__, ({ x }) => `${x} is not a prime number`)
					.exhaustive(),
			).to.equal("7 is a prime number");
		});

		it("Wild doesn't consume valid matches", () => {
			expect(
				match(1)
					.with(1, () => true)
					.with(__, () => false)
					.exhaustive(),
			).to.equal(true);
		});

		it("math equal to 48", () => {
			type Input = [number, "+", number] | [number, "-", number] | [number, "/", number] | [number, "*", number];

			const input = identity<Input>([12, "*", 4]);

			const output = match<Input>(input)
				.with([__.number, "*", __.number], ([x, _, y]) => x * y)
				.with([__.number, "+", __.number], ([x, _, y]) => x + y)
				.with([__.number, "-", __.number], ([x, _, y]) => x - y)
				.with([__.number, "/", __.number], ([x, _, y]) => x / y)
				.exhaustive();

			expect(output).to.equal(48);
		});
	});

	describe("partial match", () => {
		it("respect brickColor instance", () => {
			const brick = new BrickColor("Really black");

			const playerTeam = {
				marcus: "bye",
				brick: brick,
			};

			const matchedPlayerTeam = match(playerTeam)
				.with({ marcus: "bye", brick: new BrickColor("Really black") }, () => true)
				.with(__, () => false)
				.exhaustive();

			expect(matchedPlayerTeam).to.equal(true);
		});

		it("match string", () => {
			expect(
				match("Hello")
					.with(__.string, (str) => str + " World")
					.run(),
			).to.equal("Hello World");
		});

		it("select deep value", () => {
			expect(
				match({ foo: { bar: 1 } })
					.with({ foo: { bar: _select() } }, (a) => a)
					.exhaustive(),
			).to.equal(1);
		});
	});
};
