import { Janitor } from "@rbxts/janitor";
import { RunService } from "@rbxts/services";

const healPackage: FabricUnits["Heal"] = {
	name: "Heal",

	units: {
		Replicated: {},
	},

	defaults: {
		debounce: true,
		target: undefined,
		heal: 0,
		transparency: 0,
		particle: true,
	},

	janitor: new Janitor(),

	onInitialize: function (this) {
		const model = this.ref;
		this.janitor?.Add(
			RunService.Heartbeat.Connect((dt) => {
				for (const part of model.GetChildren()) {
					if (part !== model.PrimaryPart) {
						const Part = part as Part;
						Part.CFrame = Part.CFrame.mul(CFrame.Angles(0, math.rad(dt * 37.5), 0));
					}
				}
			}),
		);
	},

	onClientHeal: function (this, _player, amount) {
		if (this.get("debounce") === false) return;

		this.addLayer(this, {
			heal: amount,
			target: _player.Character?.FindFirstChild("Humanoid") as Humanoid,
			debounce: false,
			transparency: 1,
			particle: false,
		});

		Promise.delay(30)
			.then(() => {
				this.removeLayer(this);
				this.ref.Destroy();
			})
			.catch((reason) => warn(reason));
	},

	onDestroy: function (this) {
		this.janitor?.Destroy();
	},

	effects: [
		function (): void {
			if (this.get("target") !== undefined) {
				(this.get("target") as Humanoid).Health += this.get("heal");
			}
		},

		function (): void {
			const model = this.ref;
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
