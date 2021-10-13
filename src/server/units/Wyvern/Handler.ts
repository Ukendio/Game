const CACHE_DISTANCE = new CFrame(new Vector3(math.huge, math.huge, math.huge));

const Wyvern: FabricUnits["Wyvern"] = {
	name: "Wyvern",

	units: {
		Replicated: {},
		WyvernAbility2: {
			root: CACHE_DISTANCE,
			name: undefined,
		},
	},
};

export = Wyvern;
