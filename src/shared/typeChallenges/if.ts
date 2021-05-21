type If<C, T, F> = C extends true ? T : F;

export type A = If<true, "a", "b">;
export type B = If<false, "a", "b">;
