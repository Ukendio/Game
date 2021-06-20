import { Iterator, Vec } from "@rbxts/rust-classes";

/**
 * getVoteOrDefault takes two arguments:
 * - a list of votes sent by clients of type string
 * - a list of votable options
 * This function will return the last option if no votes were cast into the ballot
 *
 * It does this in 3 main steps:
 *  - 1. Constructs an array of the inferred pairs `LuaTuple<[string, number]>` from the type `Record<string, number>`
 * 	- 2. using an array binding pattern to separate the inferred two-tuples into values to
 * 	  subtract the difference between upper- and lower bound.
 * 	- 3. wrap highest element in option but map to the last index in `votableOptions` if it
 * 	  is of the `None` type
 */
export function getVoteOrDefault(votes: Record<string, number>, votableOptions: Vec<string>) {
	return Iterator.fromItems(...pairs(votes))
		.maxBy(([_a, aCount], [_b, bCount]) => aCount - bCount)
		.map(([name]) => name)
		.or(votableOptions.last())
		.unwrap();
}
