type Concat<T extends Array<unknown>, U extends Array<unknown>> = [...T, ...U];

export type Result = Concat<[1], [2]>;
