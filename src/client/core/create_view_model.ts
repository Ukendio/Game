import Unit from "@rbxts/fabric/src/FabricLib/Fabric/Unit";
import { Workspace } from "@rbxts/services";

enum ArmSide {
	Right = "Right",
	Left = "Left",
}

function create_arm(name: ArmSide): Part {
	const Camera = Workspace.CurrentCamera;

	const actionArm = new Instance("Part");
	actionArm.Parent = Camera;
	actionArm.Name = name;
	actionArm.Anchored = true;
	actionArm.CanCollide = false;
	actionArm.CanTouch = false;
	actionArm.Material = Enum.Material.SmoothPlastic;
	actionArm.Color = Color3.fromRGB(204, 142, 105);
	actionArm.Size = new Vector3(1.85, 0.75, 0.75);

	return actionArm;
}

interface Arms extends Model {
	Left: Part;
	Right: Part;
}

export function create_view_model(gun: Unit<"Gun">): Arms {
	const arms = new Instance("Model");
	const left_arm = create_arm(ArmSide.Left);
	const right_arm = create_arm(ArmSide.Right);

	left_arm.Parent = arms;
	right_arm.Parent = arms;
	arms.Parent = Workspace.CurrentCamera;

	return arms as Arms;
}
