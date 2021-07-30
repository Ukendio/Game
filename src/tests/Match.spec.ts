/// <reference types="@rbxts/testez/globals" />
import { Option, Result, Vec } from "@rbxts/rust-classes";
import { match, when, _select, __ } from "shared/match";

export = () => {
	describe("match number utility", () => {
		it("number is in set", () => {
			const number = 5;

			const result = match(number)
				.numberSet([1, 3, 5, 7, 11], (value) => `${value} is in array`)
				.run();

			expect(result).to.equal(`5 is in array`);
		});

		it("it is a Teen", () => {
			const number = 13;

			const result = match(number)
				.numberRange([13, 19], (value) => `${value} is a teen number`)
				.run();

			expect(result).to.equal("13 is a teen number");
		});
	});

	describe("partial match", () => {
		it("player team", () => {
			const brick = new BrickColor("Really black");

			const playerTeam = {
				marcus: "bye",
				brick: brick,
			};

			const matchedPlayerTeam = match(playerTeam)
				.with({ marcus: "bye", brick: brick }, () => true)
				.run();
			expect(matchedPlayerTeam).to.be.ok();
		});

		it("match string", () => {
			expect(
				match("Hello")
					.with(__.string, (str) => str + " World")
					.run(),
			).to.equal("Hello World");
		});
	});

	it("2 is even", () => {
		const isOdd = (x: number) => x % 2 === 1;

		const result = match({ x: 2 })
			.with({ x: when(isOdd) }, ({ x }) => `${x} is odd`)
			.with(__, ({ x }) => `${x} is even`)
			.exhaustive();

		expect(result).to.equal("2 is even");
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
			match({ x: 8 })
				.when(
					({ x }) => isPrime(x),
					({ x }) => `${x} is a prime number`,
				)
				.run(),
		);
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

		const output = match(input)
			.with([__.number, "*", __.number], ([x, _, y]) => x * y)
			.with([__.number, "+", __.number], ([x, _, y]) => x + y)
			.with([__.number, "-", __.number], ([x, _, y]) => x - y)
			.with([__.number, "/", __.number], ([x, _, y]) => x / y)
			.exhaustive();

		expect(output).to.equal(48);
	});
};
