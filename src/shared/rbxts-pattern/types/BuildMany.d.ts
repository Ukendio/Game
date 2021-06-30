import { Cast, Compute, Drop, Iterator, Next, Slice } from "./helpers";

// BuildMany :: DataStructure -> Union<[value, path][]> -> Union<DataStructure>
export type BuildMany<data, xs extends unknown[]> = xs extends unknown ? BuildOne<data, xs> : never;

// BuildOne :: DataStructure
// -> [value, path][]
// -> DataStructure
type BuildOne<data, xs extends unknown[]> = xs extends [[infer value, infer path], ...infer tail]
	? BuildOne<Update<data, value, Cast<path, unknown[]>>, tail>
	: data;

type SafeGet<data, k extends unknown, def> = k extends keyof data ? data[k] : def;

// Update :: a -> b -> PropertyKey[] -> a
type Update<data, value, path extends unknown[]> = path extends [infer head, ...infer tail]
	? data extends readonly [unknown, ...unknown[]]
		? head extends number
			? [
					...Slice<data, Iterator<head>>,
					Update<data[head], value, Cast<tail, unknown[]>>,
					...Drop<data, Next<Iterator<head>>>
			  ]
			: never
		: data extends readonly (infer a)[]
		? Update<a, value, Cast<tail, unknown[]>>[]
		: data extends Set<infer a>
		? Set<Update<a, value, Cast<tail, unknown[]>>>
		: data extends Map<infer k, infer v>
		? Map<k, Update<v, value, Cast<tail, unknown[]>>>
		: Compute<
				Omit<data, Cast<head, never>> &
					{
						[k in Cast<head, never>]: Update<SafeGet<data, k, {}>, value, Cast<tail, unknown[]>>;
					}
		  >
	: value;
