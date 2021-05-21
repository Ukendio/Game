export type TupleToObject<T extends readonly string[]> = {
	[K in T[number]]: K;
};

const tuple = ["foo", "bar", "baz"] as const;

const result: TupleToObject<typeof tuple> = {
	foo: "foo",
	bar: "bar",
	baz: "baz",
};
