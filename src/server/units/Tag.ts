import { Players, RunService } from "@rbxts/services";
import store from "server/core/store";
import { addDeathToPlayer, addKillToPlayer } from "server/core/store/actions";

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

		this.connection = RunService.Heartbeat.Connect((dt) => {
			current += dt;

			if (primaryPart) model.SetPrimaryPartCFrame(primaryPart.CFrame.mul(CFrame.Angles(math.rad(current), 0, 0)));
		});
	},

	onDestroy: function (this) {
		this.connection?.Disconnect();
		this.connection = undefined!;
		this.removeLayer(this);
	},

	effects: [
		function (this) {
			const model = this.ref as Model;
			for (const part of model.GetChildren()) {
				if (part !== model.PrimaryPart && part.IsA("BasePart")) {
					part.Transparency = this.get("transparency");
				} else {
					(part.FindFirstChild("Sparkles") as ParticleEmitter).Enabled = this.get("particleEnabled");
				}
			}
		},
		function (this) {
			const player = this.get("finder");
			const enemyPlayer = this.get("owner") ?? this.defaults!.owner;

			if (player && enemyPlayer) {
				store.dispatch(addKillToPlayer(player));
				store.dispatch(addDeathToPlayer(enemyPlayer));
			}
		},
	],
});
