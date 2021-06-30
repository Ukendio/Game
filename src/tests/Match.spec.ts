/// <reference types="@rbxts/testez/globals" />
import { Option, Result, Vec } from "@rbxts/rust-classes";
import { match, _select } from "shared/rbxts-pattern";

export = () => {
	describe("complex patterns", () => {
		it("fizzBuzz", () => {
			const fizzBuzzArray = new Array<string>(100);
			const fizzBuzzArray2 = new Array<string>(100);

			for (let current = 0; current < 100; current++) {
				const i = current + 1;
				const truthTable = [i % 3 === 0, i % 5 === 0];
				const result = match(truthTable)
					.with([true, true], () => "FizzBuzz")
					.with([true, false], () => "Fizz")
					.with([false, true], () => "Buzz")
					.otherwise(() => tostring(current));

				fizzBuzzArray.push(result);
			}

			for (let current = 0; current < 100; current++) {
				const i = current + 1;
				let result = tostring(i);
				if (i % 3 === 0 && i % 5 === 0) {
					result = "FizzBuzz";
				} else if (i % 3 === 0 && i % 5 !== 0) {
					result = "Fizz";
				} else if (i % 3 !== 0 && i % 5 === 0) {
					result = "Buzz";
				}

				fizzBuzzArray2.push(result);
			}

			const randomIndex = math.random(0, 100);
			expect(fizzBuzzArray[randomIndex] === fizzBuzzArray2[randomIndex]);
		});
	});
	describe("enum expressions", () => {
		it("adds to 15", () => {
			enum Expressions {
				Add,
				Sub,
				Div,
				Mul,
				enumMember,
			}
			const expression = Expressions.Add;

			const result = match(expression)
				.with(Expressions.Add, () => 12 + 3)
				.with(Expressions.Sub, () => 12 - 3)
				.with(Expressions.Div, () => 12 / 3)
				.with(Expressions.Mul, () => 12 * 3)
				.otherwise(() => error("This shouldn't happen"));

			expect(result).to.equal(15);
		});
		it("inspect enum function members", () => {
			const WebEvent = {
				PageLoad: "1",
				PageUnload: "2",
				KeyPress: (character: string) => character,
			};

			function inspect(event: typeof WebEvent[keyof typeof WebEvent]) {
				return match(event)
					.with(WebEvent.PageLoad, () => "page loaded")
					.with(WebEvent.PageUnload, () => "page unloaded")
					.with(WebEvent.KeyPress("S"), () => "Pressed S")
					.otherwise(() => "Invalid event");
			}

			expect(inspect(WebEvent.KeyPress("h"))).to.equal("Invalid event");
		});
	});

	describe("match number utility", () => {
		it("it is a prime", () => {
			const number = 5;

			const result = match(number)
				.numberSet([1, 3, 5, 7, 11], (value) => `${value} is a prime number`)
				.run();

			expect(result).to.equal(`5 is a prime number`);
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
		it("option", () => {
			type Option<T> = { _tag: "None" } | { _tag: "Some"; value: T };

			const value: Option<string> = { _tag: "Some", value: "Hello" };

			const isSome = match(value)
				.with({ _tag: "Some" }, () => true)
				.run();
			expect(isSome).to.be.ok();
		});

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
	});

	describe("rock paper scissors", () => {
		const enum Choice {
			ROCK = "rock",
			PAPER = "paper",
			SCISSOR = "scissor",
		}

		interface Play {
			choice: Choice;
			player: string;
		}

		function getBeats(input: Choice): Choice {
			return match(input)
				.with(Choice.ROCK, () => Choice.SCISSOR)
				.with(Choice.PAPER, () => Choice.ROCK)
				.with(Choice.SCISSOR, () => Choice.PAPER)
				.run();
		}

		function parseType(name: string): Option<Choice> {
			for (const typ of Vec.vec(Choice.ROCK, Choice.PAPER, Choice.SCISSOR).generator()) {
				if (tostring(typ).lower() === name.lower()) {
					return Option.some(typ);
				}
			}
			return Option.none<Choice>();
		}

		function randomPlayOrForce(forceChoice?: Choice): Choice {
			return forceChoice !== undefined
				? forceChoice
				: match(math.random(0, 2))
						.with(0, () => Choice.ROCK)
						.with(1, () => Choice.PAPER)
						.with(2, () => Choice.SCISSOR)
						.otherwise(() => error("Unable to generate random play!"));
		}

		function getResult(playOne: Play, playTwo: Play): Result<Play, string> {
			const userBeats = getBeats(playOne.choice);
			const computerBeats = getBeats(playTwo.choice);

			if (userBeats === playTwo.choice) {
				return Result.ok(playOne);
			} else if (computerBeats === playOne.choice) {
				return Result.ok(playTwo);
			} else return Result.err("Draw!");
		}

		it("rock wins", () => {
			const userPlay = parseType("Rock").expect("Invalid input!");
			const computerPlay = randomPlayOrForce(Choice.SCISSOR);

			const result = getResult(
				{ player: "Ukendio", choice: userPlay },
				{ player: "Computer", choice: computerPlay },
			).match(
				(won) => `${won.player} won using ${won.choice}`,
				(draw) => draw,
			);

			expect(result).to.equal("Ukendio won using rock");
		});
	});

	it("return b", () => {
		const result = match({ field1: 1, field2: "test" })
			.with({ field1: 1 }, () => "a")
			.with({ field1: 1, field2: "test" }, () => "b")
			.with({ field1: 1 }, () => "c")
			.run();

		print(result);
		expect(result).to.equal("b");
	});
};
