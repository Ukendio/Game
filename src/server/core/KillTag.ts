import { Iterator, Vec } from "@rbxts/rust-classes";

interface Context {
	player: Player;
	time_stamp: number;
	damage: number;
}

namespace KillTag {
	export function create_kill_tag(ctx: Context, character: Model) {
		character.SetAttribute(`KillTag@${ctx.player.Name}`, ctx);
	}

	export function kill_tags_into_iter(character: Model) {
		return Iterator.fromItems(...(character.GetAttributes() as Map<string, Context>)).filter((a) => {
			return a[0].find("KillTag@")[0] !== undefined ? true : false;
		});
	}

	export function get_sorted_tags(i: Iterator<[string, Context]>) {
		const vec_of_tags = i.collect();

		return function (f: (vec_of_tags: Vec<[string, Context]>) => Array<[string, Context]>) {
			return Vec.fromPtr(f(vec_of_tags));
		};
	}

	export function get_highest_tags(i: Iterator<[string, Context]>, n: number) {
		return get_sorted_tags(i)((v) => {
			const sorted_array = v.asPtr();
			table.sort(sorted_array, (a, b) => a[1].time_stamp < b[1].time_stamp);

			return sorted_array;
		}).truncate(n);
	}

	export function get_highest_tag(i: Iterator<[string, Context]>) {
		return i.maxBy(([_a, a_ctx], [_b, b_ctx]) => a_ctx.time_stamp - b_ctx.time_stamp);
	}
}

export = KillTag;
