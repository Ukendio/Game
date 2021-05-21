type Awaited<T> = T extends Promise<infer U> ? U : never;

export type extracted = Awaited<Promise<void>>;

type testFunction<T> = (value: T) => unknown;

type takeFromFunction<T> = T extends testFunction<infer U> ? U : never;

type extract = takeFromFunction<(value: string) => number>;
