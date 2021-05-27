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
