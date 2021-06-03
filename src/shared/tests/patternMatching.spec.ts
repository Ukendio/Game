/// <reference types="@rbxts/testez/globals" />
import { match, _select } from "shared/rbxts-pattern";

type Data = { type: "text"; content: string } | { type: "img"; src: string };

type Result = { type: "ok"; data: Data } | { type: "error"; errorMessage: string };

const getContent = new Promise<Result>((resolve) => {
	if (math.random(1, 5) > 2) {
		resolve({
			type: "ok",
			data: {
				type: "text",
				content: "hello",
			},
		});
	} else
		resolve({
			type: "error",
			errorMessage: "u suck",
		});
});

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
		it("should throw", () => {
			const value = {
				type: "error",
				errorMessage: "something went wrong",
			};

			const result = match(value as Result)
				.with({ type: "ok", data: { type: "text", content: "hello" } }, (result) => result.data.content)
				.with({ type: "error" }, (result) => error(`Error://${result.errorMessage}`))
				.run();

			expect(result).to.throw;
		});
	});
};
