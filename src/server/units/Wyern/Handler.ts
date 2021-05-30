const Wyvern: FabricUnits["Wyvern"] = {
	name: "Wyvern",

	onInitialize: function (this) {
		const ability2 = this.fabric.getOrCreateUnitByRef("WyvernAbility2", this.ref);
		ability2.mergeBaseLayer({});
	},
};

export = Wyvern;
