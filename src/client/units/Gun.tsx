import Roact from "@rbxts/roact";
import { Players, ReplicatedStorage, SoundService, UserInputService, Workspace } from "@rbxts/services";
import { Crosshair } from "client/UserInterface/App/Crosshair";
import HitMark from "client/UserInterface/App/HitMark";
import { shoot } from "shared/shoot";
import Dispatcher, { interval } from "shared/dispatcher";
import { match } from "shared/rbxts-pattern";
import Mode from "shared/Mode";

const player = Players.LocalPlayer;
const mouse = player.GetMouse();

const signal = new Dispatcher();

const gun: FabricUnits["Gun"] = {
	name: "Gun",

	units: {
		Replicated: [],
	},

	defaults: {
		debounce: true,
		mouseDown: false,
		equipped: false,
		target: undefined,
		hit: "Miss",
		player: undefined,
		ricochet: false,
		filter: [],
		origin: undefined,
		direction: undefined,

		configurableSettings: {
			fireRate: 1,
			recoil: 1,
			maxDistance: 400,
			mode: Mode.Semi,
			damage: 15,
		},
	},

	onInitialize: function (this) {
		const settings = this.get("configurableSettings");
		this.fabric.getOrCreateUnitByRef("Luck", this);

		let handle: Roact.Tree;
		const onEquipped = () => {
			handle = Roact.mount(
				<screengui ZIndexBehavior="Sibling">
					<Crosshair
						signal={signal}
						mouseOffset={Workspace.CurrentCamera!.ViewportSize.Y / 2 - 36}
						fireRate={settings.fireRate}
						recoil={settings.recoil}
					/>
				</screengui>,
				player.WaitForChild("PlayerGui"),
			);

			UserInputService.MouseIconEnabled = false;
		};

		const onUnequipped = () => {
			UserInputService.MouseIconEnabled = true;
			Roact.unmount(handle);
		};

		const tool = this.ref as Tool;

		tool.Equipped.Connect(onEquipped);
		tool.Unequipped.Connect(onUnequipped);

		let debounce = true;

		const raycast = () => {
			const rayCastParameters = new RaycastParams();
			rayCastParameters.FilterDescendantsInstances = [player.Character!, tool];
			rayCastParameters.FilterType = Enum.RaycastFilterType.Blacklist;

			const origin = Workspace.CurrentCamera!.CFrame;
			const direction = mouse.Hit.Position.sub(origin.Position).Unit.mul(settings.maxDistance);
			const result = Workspace.Raycast(origin.Position, direction, rayCastParameters);

			const target = result?.Instance;
			const luck = this.getUnit("Luck");
			const hit = luck?.applyLuck(math.random(10, settings.damage));

			const packet = {
				target: target,
				hit: hit,
				origin: origin,
				direction: direction,
			};

			this.getUnit("Transmitter")!.sendWithPredictiveLayer(packet, "shoot", packet);
		};

		mouse.Button1Down.Connect(() => {
			if (debounce) {
				debounce = false;
				match(settings.mode)
					.with(Mode.Semi, () => {
						raycast();
						Promise.delay(settings.fireRate).then(() => (debounce = true));
					})
					.with(Mode.Auto, () => {
						const listener = interval(settings.fireRate, raycast);
						const connection = listener.event.connect(() => {
							listener.callback();
						});

						mouse.Button1Up.Connect(() => {
							connection.disconnect();
							Promise.delay(settings.fireRate).then(() => (debounce = true));
						});
					})
					.run();
			}
		});
	},

	effects: [
		function (this) {
			const target = this.get("target");
			print(target);

			if (target !== undefined && target.Parent?.FindFirstChild("Humanoid") !== undefined) {
				const handle = Roact.mount(<HitMark hit={this.get("hit") as string} />, this.get("target") as Instance);

				Promise.delay(0.75).then(() => {
					Roact.unmount(handle);
				});
			}
		},
		function (this) {
			const target = this.get("target");
			const filter = this.get("filter");
			const origin = this.get("origin");
			const direction = this.get("direction");
			const settings = this.get("configurableSettings");

			if (origin && direction) {
				const pistolShot = ReplicatedStorage.TS.assets.PistolShot.Clone();

				pistolShot.Parent = SoundService;
				pistolShot.Play();
				pistolShot.Ended.Connect(() => pistolShot.Destroy());

				let ricochet = false;
				if (target !== undefined && target.Parent?.FindFirstChild("Humanoid") !== undefined) {
					const substrings = target.Name.split("_");

					if (substrings && substrings[1] === "shield") {
						const findPlayer = Players.GetPlayerByUserId(tonumber(substrings[0])!);
						if (findPlayer && findPlayer.Team === player.Team) {
							print(findPlayer.Team, player.Team);
							filter.push(target.Parent!);
						} else {
							ricochet = true;
							print(ricochet);
						}
					}
				}

				Promise.defer(() =>
					shoot({
						ricochet: ricochet,
						stepDistance: 4,
						startPosition: origin,
						startNormal: direction,
						filter: filter,
						maxDistance: settings.maxDistance,
					}),
				);
			}
		},
	],
};

export = gun;
