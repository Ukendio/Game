/// <reference types="@rbxts/testez/globals" />
import { match } from "shared/rbxts-pattern";

type Data = { type: "text"; content: string } | { type: "img"; src: string };

type Result = { type: "ok"; data: Data } | { type: "error"; errorMessage: string };

export = () => {
	describe("pattern", () => {
		it("should return hello", () => {
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
		it("should throw", () => {
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
	});
};
