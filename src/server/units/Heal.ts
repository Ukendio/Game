import FabricLib, { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { RunService } from "@rbxts/services";

const healPackage: FabricUnits["Heal"] = {
	name: "Heal",
	tag: "Heal",

	units: {
		Replicated: {},
	},

	defaults: {
		debounce: true,
		target: undefined!,
		heal: 0,
		transparency: 0,
		particle: true,
	},

	onInitialize: function (this) {
		const model = this.ref as Model;
		RunService.Heartbeat.Connect((dt) => {
			for (const part of model.GetChildren()) {
				if (part !== model.PrimaryPart) {
					const Part = part as Part;
					Part.CFrame = Part.CFrame.mul(CFrame.Angles(0, math.rad(dt * 37.5), 0));
				}
			}
		});
	},

	onClientHeal: function (this, _player, amount) {
		if (this.get("debounce") === false) return;

		this.addLayer(this, {
			heal: amount,
			target: _player.Character?.FindFirstChild("Humanoid"),
			debounce: false,
			transparency: 1,
			particle: false,
		});

		Promise.delay(30).then(() => this.removeLayer(this));
	},

	onDestroy: function (this) {},

	effects: [
		function (this) {
			if (this.get("target") !== undefined) {
				(this.get("target") as Humanoid).Health += this.get("heal");
			}
		},

		function (this) {
			const model = this.ref as Model;
			for (const part of model.GetChildren()) {
				if (part !== model.PrimaryPart && part.IsA("BasePart")) {
					part.Transparency = this.get("transparency");
				} else {
					(part.FindFirstChild("Sparkles") as ParticleEmitter).Enabled = this.get("particle");
				}
			}
		},
	],
};

export = healPackage;
