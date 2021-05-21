type First<T extends Array<unknown>> = T[0];

type arr1 = ["a", "b", "c"];
type arr2 = [2, 3, 4];

export type head1 = First<arr1>;
export type head2 = First<arr2>;
