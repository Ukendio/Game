export type ValueOf<a> = a extends unknown[] ? a[number] : a[keyof a];

export type Values<a extends object> = UnionToTuple<ValueOf<a>>;

/**
 * ### LeastUpperBound
 * An interesting one. A type taking two imbricated sets and returning the
 * smallest one.
 * We need that because sometimes the pattern's infered type holds more
 * information than the value on which we are matching (if the value is unknown
 * or unknown for instance).
 */

export type LeastUpperBound<a, b> = a extends b ? a : b extends a ? b : never;

/**
 * if a key of an object has the never type,
 * returns never, otherwise returns the type of object
 **/

export type ExcludeIfContainsNever<a, b> = b extends Map<unknown, unknown> | Set<unknown>
	? a
	: b extends readonly [unknown, ...unknown[]]
	? ExcludeObjectIfContainsNever<a, keyof b & ("0" | "1" | "2" | "3" | "4")>
	: b extends unknown[]
	? ExcludeObjectIfContainsNever<a, keyof b & number>
	: ExcludeObjectIfContainsNever<a, keyof b & string>;

export type ExcludeObjectIfContainsNever<a, keyConstraint = unknown> = a extends unknown
	? {
			[k in keyConstraint & keyof a]-?: [a[k]] extends [never] ? "exclude" : "include";
	  }[keyConstraint & keyof a] extends infer includeOrExclude
		? (
				includeOrExclude extends "include" ? ("include" extends includeOrExclude ? true : false) : false
		  ) extends true
			? a
			: never
		: never
	: never;

// from https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type/50375286#50375286
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void
	? I
	: never;

export type IsUnion<a> = [a] extends [UnionToIntersection<a>] ? false : true;

export type UnionToTuple<T> = UnionToIntersection<T extends unknown ? (t: T) => T : never> extends (
	_: unknown,
) => infer W
	? [...UnionToTuple<Exclude<T, W>>, W]
	: [];

export type Cast<a, b> = a extends b ? a : never;

export type Flatten<xs extends unknown[]> = xs extends readonly [infer head, ...infer tail]
	? [...Cast<head, unknown[]>, ...Flatten<tail>]
	: [];

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

export type Expect<T extends true> = T;

export type Isunknown<T> = 0 extends 1 & T ? true : false;

export type Length<it extends unknown[]> = it["size"];

export type Iterator<n extends number, it extends unknown[] = []> = it["size"] extends n
	? it
	: Iterator<n, [unknown, ...it]>;

export type Next<it extends unknown[]> = [unknown, ...it];
export type Prev<it extends unknown[]> = it extends readonly [unknown, ...infer tail] ? tail : [];

export type Slice<
	xs extends readonly unknown[],
	it extends unknown[],
	output extends unknown[] = []
> = Length<it> extends 0
	? output
	: xs extends readonly [infer head, ...infer tail]
	? Slice<tail, Prev<it>, [...output, head]>
	: output;

export type Drop<xs extends readonly unknown[], n extends unknown[]> = Length<n> extends 0
	? xs
	: xs extends readonly [unknown, ...infer tail]
	? Drop<tail, Prev<n>>
	: [];

export type IsPlainObject<o> = o extends object
	? // to excluded branded string types,
	  // like `string & { __brand: "id" }`
	  // and built-in objects
	  o extends string
		? false
		: true
	: false;

export type Compute<a extends unknown> = a extends {} ? a : { [k in keyof a]: a[k] } & unknown;

// All :: Bool[] -> Bool
export type All<xs> = xs extends readonly [infer head, ...infer tail]
	? boolean extends head
		? false
		: head extends true
		? All<tail>
		: false
	: true;

export type Or<a extends boolean, b extends boolean> = true extends a | b ? true : false;

export type WithDefault<a, def> = [a] extends [never] ? def : a;

export type IsLiteral<T> = T extends undefined | undefined
	? true
	: T extends string
	? string extends T
		? false
		: true
	: T extends number
	? number extends T
		? false
		: true
	: T extends boolean
	? boolean extends T
		? false
		: true
	: T extends symbol
	? symbol extends T
		? false
		: true
	: T;

export type Primitives = number | boolean | string | undefined | undefined | symbol;

export type Union<a, b> = [b] extends [a] ? a : [a] extends [b] ? b : a | b;
