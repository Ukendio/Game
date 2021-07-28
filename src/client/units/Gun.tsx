import Roact from "@rbxts/roact";
import { Players, ReplicatedStorage, SoundService, UserInputService, Workspace } from "@rbxts/services";
import { Config, Mode } from "shared/Types";
import Crosshair from "client/ui/app/Crosshair";
import HitMark from "client/ui/app/HitMark";
import { match } from "shared/match";
import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Janitor } from "@rbxts/janitor";
import Yessir, { interval } from "@rbxts/yessir";
import { CylinderRenderer, Projectile } from "@rbxts/projectile";

const player = Players.LocalPlayer;
const mouse = player.GetMouse();
const random = new Random();
const signal = new Yessir();

declare global {
	interface FabricUnits {
		Gun: GunDefinition;
	}
}

interface GunDefinition extends UnitDefinition<"Gun"> {
	name: "Gun";

	units: {
		Replicated: {};
		Luck?: {};
	};

	defaults?: {
		debounce: boolean;
		mouseDown: boolean;
		equipped: boolean;
		target: BasePart | undefined;
		hit: string | undefined;
		player: Player | undefined;
		ricochet: boolean;
		filter: Instance[];
		origin: undefined | Vector3;
		velocity: undefined | Vector3;
		configurableSettings: Config;
	};

	ref?: Tool;

	onClientShoot?: (
		this: ThisFabricUnit<"Gun">,
		_player: Player,
		data: {
			target: BasePart;
			hit: string;
		},
	) => void;

	configureSettings?: (this: ThisFabricUnit<"Gun">, configurableSettings: Config) => void;

	janitor?: Janitor;
}
const gun: GunDefinition = {
	name: "Gun",

	units: {
		Replicated: {},
		Luck: {},
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
		velocity: undefined,

		configurableSettings: {
			fireRate: 1,
			recoil: 1,
			maxDistance: 400,
			mode: Mode.Semi,
			damage: 15,
		},
	},

	janitor: new Janitor(),

	onInitialize: function (this) {
		const settings = this.defaults!.configurableSettings;

		let handle: Roact.Tree;
		let equipped = false;

		const onEquipped = () => {
			equipped = true;
			handle = Roact.mount(
				<screengui ZIndexBehavior="Sibling">
					<Crosshair
						signal={signal}
						offset={Workspace.CurrentCamera!.ViewportSize.Y / 2 - 36}
						fireRate={settings.fireRate}
						recoil={settings.recoil}
					/>
				</screengui>,
				player.WaitForChild("PlayerGui"),
			);

			UserInputService.MouseIconEnabled = false;
		};

		const onUnequipped = () => {
			equipped = false;
			UserInputService.MouseIconEnabled = true;
			Roact.unmount(handle);
		};

		const tool = this.ref as Tool;

		let debounce = true;

		const raycast = () => {
			const rayCastParameters = new RaycastParams();
			rayCastParameters.FilterDescendantsInstances = [player.Character!, tool];
			rayCastParameters.FilterType = Enum.RaycastFilterType.Blacklist;

			const origin = Workspace.CurrentCamera!.CFrame;
			const endPosition = mouse.Hit.Position;
			const direction = endPosition.sub(origin.Position).Unit.mul(settings.maxDistance);
			const result = Workspace.Raycast(origin.Position, direction, rayCastParameters);

			const velocity = new CFrame(origin.Position, endPosition)
				.mul(CFrame.Angles(0, 0, random.NextNumber(0, 2 * math.pi)))
				.mul(CFrame.Angles(0, random.NextNumber(math.rad(0), math.rad(10)), 0))
				.LookVector.mul(75);

			const target = result?.Instance;
			const luck = this.getUnit("Luck");
			const hit = luck?.applyLuck(math.random(10, settings.damage));

			this.getUnit("Transmitter")!.sendWithPredictiveLayer(
				{
					origin: origin.Position,
					velocity: velocity,
				},
				"shoot",
				{ target: target, hit: hit },
			);
		};

		this.janitor?.Add(tool.Equipped.Connect(onEquipped));
		this.janitor?.Add(tool.Unequipped.Connect(onUnequipped));
		this.janitor?.Add(
			mouse.Button1Down.Connect(() => {
				if (debounce && equipped) {
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
			}),
		);
	},

	onDestroy: function (this) {
		this.janitor?.Destroy();
	},

	effects: [
		function (this) {
			const target = this.get("target");

			if (target !== undefined && target.Parent?.FindFirstChild("Humanoid") !== undefined) {
				const handle = Roact.mount(<HitMark hit={this.get("hit") as string} />, this.get("target") as Instance);

				Promise.delay(0.75).then(() => {
					Roact.unmount(handle);
				});
			}
		},
		function (this) {
			const filter = this.get("filter");
			const position = this.get("origin");
			const velocity = this.get("velocity");

			if (position && velocity) {
				const projectile = new Projectile({
					position,
					velocity: new Vector3(),
					acceleration: new Vector3(0, -50, 0),

					bounce: false,
					life: 4,
					penetration: true,
					minExitVelocity: 50,
					physicsIgnore: filter,

					renderer: new CylinderRenderer(Color3.fromHSV(0, 0, 1)),
				});
			}
		},

		function (this) {
			const pistolShot = ReplicatedStorage.assets.PistolShot.Clone();

			pistolShot.Parent = SoundService;
			pistolShot.Play();
			pistolShot.Ended.Connect(() => pistolShot.Destroy());
		},
	],
};

export = gun;
