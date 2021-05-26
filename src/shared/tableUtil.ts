export function copyShallow<T>(obj: WritableProperties<T>): T {
	const t = {} as T;
	for (const [k, v] of pairs(obj)) {
		t[k as never] = v as never;
	}
	return t as T;
}
