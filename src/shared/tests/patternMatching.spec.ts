/// <reference types="@rbxts/testez/globals" />
import { Option, Result } from "@rbxts/rust-classes";
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
					.with(WebEvent.PageLoad, () => print("page loaded"))
					.with(WebEvent.PageUnload, () => print("page unloaded"))
					.with(WebEvent.KeyPress("S"), () => print("Pressed S"))
					.otherwise(() => "Invalid event");
			}

			expect(inspect(WebEvent.KeyPress("1"))).to.equal("Invalid event");
		});
	});
	describe("Match with Option", () => {
		it("return 1", () => {
			function checkOptional(optional: Option<number>) {
				return match(optional)
					.with(Option.some(2), () => 2)
					.with(Option.some(1), () => 1)
					.with(Option.none<number>(), () => error("No numbers were put"))
					.run();
			}

			expect(checkOptional(Option.some(1))).to.equal(1);
		});
		it("throw when optional is None", () => {
			function checkOptional(optional: Option<number>) {
				return match(optional)
					.with(Option.some(10), () => print("this shouldn't ever happen"))
					.with(Option.none<number>(), () => error("No numbers were put"))
					.run();
			}

			expect(() => checkOptional(Option.none())).to.throw;
		});
	});
	describe("Match with Result", () => {
		it("unwrapped result as 1", () => {
			function checkOptional(optional: Option<number>) {
				return match(optional)
					.with(Option.some(1), () => Result.ok(1))
					.with(Option.none<number>(), () => Result.err("No numbers were put"))
					.run();
			}

			expect(checkOptional(Option.some(1)).unwrap()).to.equal(1);
		});
		it("valid version", () => {
			enum Version {
				Version1,
				Version2,
			}

			function parseVersion(header: Array<number>) {
				const getHeader = new Option(header.shift());

				return match(getHeader)
					.with(Option.none<number>(), () => Result.err("Invalid version"))
					.with(Option.some(1), () => Result.ok(Version.Version1))
					.with(Option.some(2), () => Result.ok(Version.Version2))
					.otherwise(() => Result.err("Invalid version length"));
			}

			const version = parseVersion([1, 2, 3, 4]);

			expect(version.isOk()).to.be.ok;
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
};
