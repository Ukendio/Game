const Wyvern: FabricUnits["Wyvern"] = {
	name: "Wyvern",

	units: {
		Replicated: [],
	},

	onInitialize: function (this) {
		print(this.ref);
		const ability2 = this.getOrCreateUnit("WyvernAbility2");
		ability2.mergeBaseLayer({});
	},
};

export = Wyvern;
