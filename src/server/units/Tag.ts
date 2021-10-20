import { Janitor } from "@rbxts/janitor";
import { RunService } from "@rbxts/services";
import store from "server/core/rodux/store";

export = identity<FabricUnits["Tag"]>({
	name: "Tag",

	units: { Replicated: {} },

	defaults: {
		debounce: true,
		target: undefined,
		transparency: 0,
		particleEnabled: true,
		owner: undefined,
		finder: undefined,
	},

	janitor: new Janitor(),

	onClientTag: function (this, _player, packet) {
		if (this.get("debounce")) {
			this.addLayer(this, {
				transparency: packet.transparency,
				finder: _player,
			});
		}
	},

	onInitialize: function (this) {
		const model = this.ref;
		const primaryPart = model.PrimaryPart;
		let current = 0;

		this.janitor.Add(
			RunService.Heartbeat.Connect((dt) => {
				current += dt;

				if (primaryPart) {
					model.SetPrimaryPartCFrame(primaryPart.CFrame.mul(CFrame.Angles(math.rad(current), 0, 0)));
				}
			}),
		);
	},

	onDestroy: function (this) {
		this.janitor.Destroy();
		this.removeLayer(this);
	},

	effects: [
		function (this): void {
			const model = this.ref;
			for (const part of model.GetChildren()) {
				if (part !== model.PrimaryPart && part.IsA("BasePart")) {
					part.Transparency = this.get("transparency");
				} else {
					(part.FindFirstChild("Sparkles") as ParticleEmitter).Enabled = this.get("particleEnabled");
				}
			}
		},
		function (this): void {
			const player = this.get("finder");
			const enemyPlayer = this.get("owner") ?? this.defaults!.owner;

			if (player && enemyPlayer) {
				store.dispatch({ type: "AddKillToPlayer", player: player });
				store.dispatch({ type: "AddDeathToPlayer", player: enemyPlayer });
			}
		},
	],
});
