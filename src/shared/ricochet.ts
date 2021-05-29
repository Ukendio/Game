import { RunService, Workspace } from "@rbxts/services";
import { copyShallow } from "./tableUtil";

interface Options {
	overrideDistance?: number;
	stepDistance: number;
	currentPosition: Vector3;
	currentNormal: Vector3;
	currentDistance: number;
	maximumDistance: number;
	bullet: BasePart;
	filter: Instance[];
}

function step(options: Options) {
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
	print(options.currentPosition, laser.CFrame);

	const oldPosition = currentPosition;
	currentPosition = position;

	if (result) {
		const normal = result.Normal;
		const reflect = currentNormal.sub(currentNormal.mul(currentNormal.Dot(normal)).mul(2));
		const newOptions = copyShallow<Options>(options);
		newOptions.currentPosition = position;
		newOptions.overrideDistance = options.stepDistance - position.sub(oldPosition).Magnitude;
		newOptions.currentNormal = reflect;

		print(newOptions.currentPosition === options.currentPosition);
		step(newOptions);
		return;
	}

	const newOptions = copyShallow<Options>(options);
	newOptions.currentDistance += position.sub(oldPosition).Magnitude;

	const currentDistance = newOptions.currentDistance;
	const maximumDistance = newOptions.maximumDistance;

	if (currentDistance > maximumDistance - 75) {
		const d = (currentDistance - (maximumDistance - 75)) / 75;
		laser.Transparency = d;
	}

	if (currentDistance < maximumDistance) {
		RunService.RenderStepped.Wait();
		print(currentDistance);
		step(newOptions);
	}
}

export function ricochet(startPosition: Vector3, startNormal: Vector3, filter: Instance[]) {
	const laser = new Instance("Part");
	laser.CanCollide = false;
	laser.Size = new Vector3(0.2, 0.2, 0.2);
	laser.Anchored = true;
	laser.Parent = Workspace;
	laser.Name = "Laser";

	print("ricochet");

	const maximumDistance = 200;
	const currentDistance = 0;

	const stepDistance = 4;

	step({
		stepDistance: stepDistance,
		currentPosition: startPosition,
		currentNormal: startNormal,
		currentDistance: currentDistance,
		maximumDistance: maximumDistance,
		bullet: laser,
		filter: filter,
	});

	laser.Destroy();
}
