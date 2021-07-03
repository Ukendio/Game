import Roact from "@rbxts/roact";
import TeamButton from "../Components/TeamButton";

const triangularNumber = (sum: number) => {
	return (sum * (sum + 1)) / 2;
};
const cantorFunction = (i: number, j: number) => {
	const sum = i + j;
	const triangularSum = triangularNumber(sum);

	return triangularSum + j;
};

class TeamSelection extends Roact.Component {
	render() {
		const children = new Array<Roact.Element>();
		for (let i = 0; i < 5; i++) {
			children.push(<TeamButton teamIndex={i} />);
		}
		return <frame Size={UDim2.fromOffset(350, 350)}>{...children}</frame>;
	}
}

export = TeamSelection;
