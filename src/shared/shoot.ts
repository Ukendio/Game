import { RunService, Workspace } from "@rbxts/services";
import { copyShallow } from "./tableUtil";

interface Options {
	overrideDistance?: number;
	stepDistance?: number;
	currentPosition?: Vector3;
	currentNormal?: Vector3;
	currentDistance?: number;
	maximumDistance?: number;
	bullet?: BasePart;
	filter?: Instance[];
}

function step(options: Required<Options>) {
	const rayCastParameters = new RaycastParams();
	rayCastParameters.FilterDescendantsInstances = options.filter;
	rayCastParameters.FilterType = Enum.RaycastFilterType.Blacklist;

	let currentPosition = options.currentPosition;
	const currentNormal = options.currentNormal;
	const direction = currentNormal.mul(options.overrideDistance ?? options.stepDistance);
	const result = Workspace.Raycast(currentPosition, direction);

	const position = result?.Position ?? currentPosition.add(direction);

	const laser = options.bullet;
	laser.Size = new Vector3(0.4, 0.4, position.sub(currentPosition).Magnitude);
	laser.CFrame = new CFrame(currentPosition.Lerp(position, 0.5), position);

	const oldPosition = currentPosition;
	currentPosition = position;

	if (result) {
		const normal = result.Normal;
		const reflect = currentNormal.sub(normal.mul(currentNormal.Dot(normal)).mul(2));
		const newOptions = copyShallow<Required<Options>>(options);
		newOptions.currentPosition = position;
		newOptions.overrideDistance = options.stepDistance - position.sub(oldPosition).Magnitude;
		newOptions.currentNormal = reflect;

		step(newOptions);
		return;
	}

	const newOptions = copyShallow<Required<Options>>(options);
	newOptions.currentDistance += position.sub(oldPosition).Magnitude;
	newOptions.currentPosition = currentPosition;

	const currentDistance = newOptions.currentDistance;
	const maximumDistance = newOptions.maximumDistance;

	if (currentDistance > maximumDistance - 75) {
		const d = (currentDistance - (maximumDistance - 75)) / 75;
		laser.Transparency = d;
	}

	if (currentDistance < maximumDistance) {
		RunService.Heartbeat.Wait();
		step(newOptions);
	}
}

interface BulletConstructor {
	ricochet: boolean;
	stepDistance: number;
	startPosition: Vector3;
	startNormal: Vector3;
	filter: Instance[];
	maxDistance: number;
}

export function shoot(options: BulletConstructor) {
	const laser = new Instance("Part");
	laser.CanCollide = false;
	laser.Size = new Vector3(0.2, 0.2, 0.2);
	laser.Anchored = true;
	laser.Parent = Workspace;
	laser.Name = "Laser";
	laser.Material = Enum.Material.Neon;

	if (options.ricochet) {
		const maximumDistance = options.maxDistance;
		const currentDistance = 0;

		step({
			overrideDistance: undefined!,
			stepDistance: options.stepDistance,
			currentPosition: options.startPosition,
			currentNormal: options.startNormal,
			currentDistance: currentDistance,
			maximumDistance: maximumDistance,
			bullet: laser,
			filter: options.filter,
		});
	} else {
		let traversed = 0;
		let currentPosition = options.startPosition;
		const direction = options.startNormal.Unit.mul(options.stepDistance);

		while (traversed < options.maxDistance) {
			const position = currentPosition.add(direction);
			laser.CFrame = new CFrame(currentPosition.Lerp(position, 0.5), position);
			const oldPosition = currentPosition;
			currentPosition = position;

			traversed += position.sub(oldPosition).Magnitude;

			RunService.Heartbeat.Wait();
		}

		laser.Destroy();
	}
}
