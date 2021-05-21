import FabricLib, { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";

declare global {
	interface FabricUnits {
		Gun: GunDefinition;
	}
}

interface GunDefinition extends UnitDefinition<"Gun"> {
	name: "Gun";
	tag: "Gun";

	units: {
		Replicated: {};
	};

	defaults?: {
		damage: number;
		debounce: boolean;
		mouseDown: boolean;
		equipped: boolean;
	};

	onClientShoot?: (this: ThisFabricUnit<"Gun">, _player: Player, damage: number) => void;
}

const gun: GunDefinition = {
	name: "Gun",
	tag: "Gun",

	units: {
		Replicated: {},
	},

	defaults: {
		damage: 0,
		debounce: true,
		mouseDown: false,
		equipped: false,
	},

	onInitialize: function (this) {
		this.fabric.getOrCreateUnitByRef("Luck", this);
	},

	onClientShoot: function (this, _player, amount) {
		const luck = this.fabric.getOrCreateUnitByRef("Luck", this);
		this.addLayer(this, {
			damage: luck.applyLuck!(amount),
		});

		Promise.delay(5).then(() => {
			this.removeLayer(this);
		});
	},
};

export = gun;
