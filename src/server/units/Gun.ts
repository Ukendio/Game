import { Players } from "@rbxts/services";
import { addDeathToPlayer, addKillToPlayer, competitorStore } from "server/core/Competitor";
import { roundStore } from "server/core/Round";
import { addKillToTeam, addDeathToTeam, teamStore } from "server/core/Team";

const FIRE_RATE = 1;

function addKill(player: Player, target: BasePart) {
	const killMap = {
		["Team Deathmatch"]: () => {
			if (roundStore.getState().sequence === "intermission") return;

			competitorStore.dispatch(addKillToPlayer(player));
			competitorStore.dispatch(addDeathToPlayer(player));

			teamStore.getState().teams.forEach((team) => {
				if (team.tag === player.Team) {
					teamStore.dispatch(addKillToTeam(team));
				} else if (team.tag === Players.GetPlayerFromCharacter(target.Parent)!.Team) {
					teamStore.dispatch(addDeathToTeam(team));
				}
			});
		},

		["Free For All"]: () => {
			if (roundStore.getState().sequence === "intermission") return;

			competitorStore.dispatch(addKillToPlayer(player));
			competitorStore.dispatch(addDeathToPlayer(player));
		},
	};

	return killMap;
}

const gun: FabricUnits["Gun"] = {
	name: "Gun",

	units: {
		Replicated: [],
	},

	defaults: {
		debounce: true,
		mouseDown: false,
		equipped: false,
		target: undefined!,
		hit: undefined!,
		player: undefined!,
		ricochet: false,
	},

	onInitialize: function (this) {
		this.fabric.getOrCreateUnitByRef("Luck", this);
	},

	onClientShoot: function (this, _player, target) {
		if (this.get("debounce") === true) {
			const luck = this.fabric.getOrCreateUnitByRef("Luck", this);

			this.addLayer("damage", {
				ricochet: target.Name.find("Shield")[0] !== undefined,
				debounce: false,
				hit: luck.applyLuck(math.random(10, 50)),
				player: _player,
				target: target,
			});

			Promise.delay(FIRE_RATE).then(() => {
				this.removeLayer("damage");
			});
		}
	},

	effects: [
		function (this) {
			const damage = this.get("hit");
			const target = this.get("target");
			if (damage !== undefined && typeIs(damage, "string") && damage !== "Miss" && target !== undefined) {
				const player = this.get("player");

				const humanoid = (target.Parent as Model).FindFirstChildOfClass("Humanoid");

				if (humanoid && player) {
					humanoid.TakeDamage(tonumber(this.get("hit") as string)!);

					if (humanoid.Health <= 0) addKill(player, target)[roundStore.getState().gameMode];
				}
			}
		},
	],
};

export = gun;
