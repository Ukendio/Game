type Exclude<T, U> = T extends U ? never : T;

type random = "foo" | "bar" | "baz";
export type excludeBar = Exclude<random, "bar">;
