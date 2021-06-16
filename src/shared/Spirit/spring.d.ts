interface Spring<T> {
	Update<T extends Vector3 | Vector2 | number>(dt: number, goal: T): T;

	Reset(pos: Vector3 | Vector2 | number): void;
}
declare const Spring: new <T>(f: T, p: Vector3 | Vector2 | number) => Spring<T>;
export = Spring;
