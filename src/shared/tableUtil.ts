export function copyShallow<T extends object>(obj: T): T {
	const t = {} as T;
	for (const [k, v] of pairs(obj)) {
		t[k as never] = v as never;
	}
	return t;
}

export function getKeys<T extends object>(obj: T) {
	const t = new Array<keyof T>();
	for (const [k] of pairs(obj)) {
		t.push(k);
	}

	return t;
}

export function assertFuzzyEq(a: object, b: object) {
	if (typeOf(a) !== typeOf(b)) {
		return false;
	}

	if (typeOf(a) === "table") {
		const visitedKeys = new Map<unknown, boolean>();

		for (const [k, v] of pairs(a)) {
			visitedKeys.set(k, true);

			const ok = assertFuzzyEq(v, b[k as never]);
			if (!ok) {
				return false;
			}
		}

		for (const [k, v] of pairs(b)) {
			if (!visitedKeys.get(k)) {
				const ok = assertFuzzyEq(v, a[k as never]);
				if (!ok) {
					return false;
				}
			}
		}

		return true;
	}

	if (a === b) return true;

	return false;
}
