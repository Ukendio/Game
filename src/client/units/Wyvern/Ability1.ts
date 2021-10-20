import { ThisFabricUnit, UnitDefinition } from "@rbxts/fabric";
import { Players, Workspace } from "@rbxts/services";

declare global {
	interface FabricUnits {
		WyvernAbility1: WyvernAbility1Definition;
	}
}

interface WyvernAbility1Definition extends UnitDefinition<"WyvernAbility1"> {
	name: "WyvernAbility1";

	defaults?: {
		host: Instance | undefined;
		velocity: Vector3;
		maxForce: Vector3;
	};

	execute: (this: ThisFabricUnit<"WyvernAbility1">) => void;
}

const player = Players.LocalPlayer;

const speed = 50;
const force = 40000;

let camera = Workspace.CurrentCamera!;
Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(() => {
	const newCamera = Workspace.CurrentCamera;
	if (newCamera) camera = newCamera;
});

const bodyVelocity = new Instance("BodyVelocity");

const wyvernAbility1 = identity<WyvernAbility1Definition>({
	name: "WyvernAbility1",

	execute: function (this) {
		const character = player.Character;
		const humanoidRootPart = character?.WaitForChild("HumanoidRootPart");

		if (character && humanoidRootPart) {
			this.addLayer("velocity", {
				host: humanoidRootPart,
				velocity: camera.CFrame.LookVector.mul(speed).add(new Vector3(0, 0.5, 0)),
				maxForce: new Vector3(1, 0, 1).mul(force),
			});

			task.delay(0.25, () => this.removeLayer("velocity"));
		}
	},

	effects: [
		function (this): void {
			const host = this.get("host");
			const velocity = this.get("velocity");
			const maxForce = this.get("maxForce");
			bodyVelocity.Velocity = velocity;
			bodyVelocity.MaxForce = maxForce;

			bodyVelocity.Parent = host;
		},
	],
});

export = wyvernAbility1;
