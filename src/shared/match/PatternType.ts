export enum PatternType {
	String = "@rbxts-pattern/string",
	Number = "@rbxts-pattern/number",
	Boolean = "@rbxts-pattern/boolean",
	Guard = "@rbxts-pattern/guard",
	Not = "@rbxts-pattern/not",
	NamedSelect = "@rbxts-pattern/named-select",
	AnonymousSelect = "@rbxts-pattern/anonymous-select",
}

/**
 * ### Catch All wildcard
 * `__` is wildcard pattern, matching **any value**.
 *
 * `__.string` is wildcard pattern matching any **string**.
 *
 * `__.number` is wildcard pattern matching any **number**.
 *
 * `__.boolean` is wildcard pattern matching any **boolean**.
 * @example
 *  match(value)
 *   .with(__, () => 'will always match')
 *   .with(__.string, () => 'will match on strings only')
 *   .with(__.number, () => 'will match on numbers only')
 *   .with(__.boolean, () => 'will match on booleans only')
 */

export interface __ {
	string: string;
	number: string;
	boolean: string;
}

export const __ = {
	string: PatternType.String,
	number: PatternType.Number,
	boolean: PatternType.Boolean,
};
