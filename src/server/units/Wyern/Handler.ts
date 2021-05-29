const Wyvern: FabricUnits["Wyvern"] = {
	name: "Wyvern",

	onInitialize: function (this) {
		const ability2 = this.getOrCreateUnit("WyvernAbility2");
		ability2.mergeBaseLayer({});
	},
};

export = Wyvern;
