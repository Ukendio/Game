import Roact from "@rbxts/roact";
import { Players, ReplicatedStorage, SoundService, UserInputService, Workspace } from "@rbxts/services";
import { Crosshair } from "client/UserInterface/App/Crosshair";
import HitMark from "client/UserInterface/App/HitMark";
import { shoot } from "shared/shoot";
import Dispatcher from "shared/dispatcher";

interface ClientShootEffectsOptions {
	target: BasePart | undefined;
	filter: Instance[];
	origin: Vector3;
	direction: Vector3;
}

function clientShootEffects(options: ClientShootEffectsOptions) {
	const pistolShot = ReplicatedStorage.TS.assets.PistolShot.Clone();

	pistolShot.Parent = SoundService;
	pistolShot.Play();
	pistolShot.Ended.Connect(() => pistolShot.Destroy());

	const target = options.target;
	const filter = options.filter;
	const origin = options.origin;
	const direction = options.direction;

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
			maxDistance: SETTINGS.maxDistance,
		}),
	);
}

const player = Players.LocalPlayer;
const mouse = player.GetMouse();
const SETTINGS = {
	fireRate: 1,
	recoil: 1,
	maxDistance: 400,
};

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
	},

	onInitialize: function (this) {
		this.fabric.getOrCreateUnitByRef("Luck", this);

		let handle: Roact.Tree;
		const onEquipped = () => {
			handle = Roact.mount(
				<screengui ZIndexBehavior="Sibling">
					<Crosshair
						signal={signal}
						mouseOffset={Workspace.CurrentCamera!.ViewportSize.Y / 2 - 36}
						fireRate={SETTINGS.fireRate}
						recoil={SETTINGS.recoil}
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
		tool.Activated.Connect(() => {
			if (debounce === true) {
				debounce = false;
				signal.fire();

				const rayCastParameters = new RaycastParams();
				rayCastParameters.FilterDescendantsInstances = [player.Character!, tool];

				rayCastParameters.FilterType = Enum.RaycastFilterType.Blacklist;

				const origin = Workspace.CurrentCamera!.CFrame;
				const direction = mouse.Hit.Position.sub(origin.Position).Unit.mul(SETTINGS.maxDistance);
				const result = Workspace.Raycast(origin.Position, direction, rayCastParameters);

				const target = result?.Instance;
				const luck = this.getUnit("Luck");
				const hit = luck?.applyLuck(math.random(10, 50));
				const packet = {
					target: target,
					hit: hit,
				};
				print(hit);
				print(packet, "client");

				clientShootEffects({
					target: target,
					filter: [this.ref, player.Character!],
					origin: origin.Position,
					direction: direction,
				});

				this.getUnit("Transmitter")!.sendWithPredictiveLayer(packet, "shoot", packet);

				Promise.delay(SETTINGS.fireRate).then(() => (debounce = true));
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
	],
};

export = gun;
