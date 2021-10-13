export = class Spring<T extends Vector3 | Vector2 | number> {
	private f;
	private p: T;
	private v;
	constructor(freq: number, pos: T) {
		this.f = freq;
		this.p = pos;
		this.v = ((pos as unknown) as number) * 0;
	}

	update(dt: number, goal: T): T {
		const f = this.f * 2 * math.pi;
		const p0 = this.p;
		const v0 = this.v;

		const offset = ((goal as unknown) as number) - ((p0 as unknown) as number);
		const decay = math.exp(-f * dt);
		const p1 = ((goal as unknown) as number) + (v0 * dt - offset * (f * dt + 1)) * decay;
		const v1 = (f * dt * (offset * f - v0) + v0) * decay;

		this.p = p1 as T;
		this.v = v1;

		return p1 as T;
	}

	reset(pos: T): void {
		this.p = pos;
		this.v = ((pos as unknown) as number) * 0;
	}
};
