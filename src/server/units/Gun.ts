import { Players } from "@rbxts/services";
import store from "server/core/store";
import { addKillToPlayer, addDeathToPlayer, addKillToTeam, addDeathToTeam } from "server/core/store/actions";

const FIRE_RATE = 1;

function addKill(player: Player, target: BasePart) {
	const killMap = {
		["Team Deathmatch"]: () => {
			if (store.getState().sequence === "intermission") return;

			store.dispatch(addKillToPlayer(player));
			store.dispatch(addDeathToPlayer(player));

			store.getState().teams.forEach((team) => {
				if (team.tag === player.Team) {
					store.dispatch(addKillToTeam(team));
				} else if (team.tag === Players.GetPlayerFromCharacter(target.Parent)!.Team) {
					store.dispatch(addDeathToTeam(team));
				}
			});
		},

		["Free For All"]: () => {
			if (store.getState().sequence === "intermission") return;

			store.dispatch(addKillToPlayer(player));
			store.dispatch(addDeathToPlayer(player));
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
		filter: [],
	},

	onInitialize: function (this) {
		this.fabric.getOrCreateUnitByRef("Luck", this);
	},

	onClientShoot: function (this, _player, target) {
		if (this.get("debounce") === true) {
			const luck = this.getUnit("Luck");

			const filter = [this.ref, _player, _player.Team!] as Instance[];
			let ricochet = false;

			if (target) {
				const substrings = target.Name.split("_");

				if (substrings && substrings[1] === "shield") {
					const findPlayer = Players.GetPlayerByUserId(tonumber(substrings[0])!);
					if (findPlayer && findPlayer.Team === _player.Team) {
						filter.push(target.Parent!);
					} else ricochet = true;
				}
			}

			print(ricochet);
			this.addLayer("damage", {
				ricochet: ricochet,
				debounce: false,
				hit: luck?.applyLuck(math.random(10, 50)),
				player: _player,
				target: target,
				filter: filter,
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
			print(damage, target);
			if (damage !== undefined && damage !== "Miss" && target !== undefined) {
				const humanoid = (target.Parent as Model).FindFirstChildOfClass("Humanoid");

				if (humanoid) {
					humanoid.TakeDamage(tonumber(this.get("hit") as string)!);

					if (humanoid.Health <= 0) addKill(this.get("player"), target)[store.getState().gameMode];
				}
			}
		},
	],
};

export = gun;
