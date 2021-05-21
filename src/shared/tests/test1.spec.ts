/// <reference types="@rbxts/testez/globals" />

export = () => {
	describe("Test", () => {
		it("Adds to 5", () => {
			function add(a: number, b: number) {
				return a + b;
			}
			const sum = add(1, 4);
			expect(sum).to.equal(5);
		});
	});
};
