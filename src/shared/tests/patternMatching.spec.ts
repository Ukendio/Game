/// <reference types="@rbxts/testez/globals" />
import { Option } from "@rbxts/rust-classes";
import { match, _select } from "shared/rbxts-pattern";

type Data = { type: "text"; content: string } | { type: "img"; src: string };

type Result = { type: "ok"; data: Data } | { type: "error"; errorMessage: string };

export = () => {
	describe("pattern", () => {
		it("return hello", () => {
			const value = {
				type: "ok",
				data: {
					type: "text",
					content: "hello",
				},
			};

			const result = match(value as Result)
				.with({ type: "ok", data: { type: "text", content: "hello" } }, (result) => result.data.content)
				.run();

			expect(result).to.equal("hello");
		});
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
		it("throw when input is of error type", () => {
			const value = {
				type: "error",
				errorMessage: "something went wrong",
			};

			expect(() =>
				match(value as Result)
					.with({ type: "ok", data: { type: "text", content: "hello" } }, (result) => result.data.content)
					.with({ type: "error" }, (result) => error(`Error://${result.errorMessage}`))
					.run(),
			).to.throw;
		});
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
};
