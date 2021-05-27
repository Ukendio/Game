import Roact from "@rbxts/roact";
import { Indicator } from "client/UserInterface/Components/Indicator";
import { Janitor } from "@rbxts/janitor";
import Rodux from "@rbxts/rodux";

import { Players } from "@rbxts/services";
interface ImageLabelState {
	transparency: number;
	indicators: Array<Roact.Element>;
}
interface Props {}

const player = Players.LocalPlayer;

let debounce = true;

function interpolate(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

function getPlayer(name: string) {
	for (const player of Players.GetPlayers()) {
		if (player.Name === name && player.Character !== undefined && player.Character.Parent !== undefined) {
			return player.Character!;
		}
	}
}

export class RedVignette extends Roact.Component<Props, ImageLabelState> {
	state = {
		transparency: 1,
		sound: new Instance("Sound"),
		allSounds: ["rbxassetid://6689433512", "rbxassetid://6689433579", "rbxassetid://6689433626"],
		source: (undefined as unknown) as Model,
		indicatorExpired: false,
		indicators: new Array<Roact.Element>(),
	};

	didMount() {
		const humanoid = player.Character?.WaitForChild("Humanoid") as Humanoid;
		const sound = this.state.sound;
		sound.Parent = player.Character;

		if (humanoid !== undefined) {
			(player.Character as Model).ChildAdded.Connect((child) => {
				if (child.IsA("ObjectValue") && child.Name === "creator") {
					const element = <Indicator source={(child.Value as Player).Character!} visible={true} />;
					const index = this.state.indicators.push(element);

					Promise.delay(5).then(() => this.state.indicators.remove(index));
				}
			});
			humanoid.HealthChanged.Connect((health) => {
				const percent = health / humanoid.MaxHealth;

				if (debounce === true) {
					debounce = false;
					sound.SoundId = this.state.allSounds[new Random().NextInteger(0, 2)];
					sound.Play();

					Promise.delay(5).then(() => {
						debounce = true;
					});
				}

				this.setState(() => {
					return {
						transparency: interpolate(1.5, 0.05, 1 - percent),
						indicators: this.state.indicators,
					};
				});
			});
		}
	}

	render(): Roact.Fragment {
		return (
			<Roact.Fragment>
				<imagelabel
					Key={"RedVignette"}
					Image={"http://www.roblox.com/asset/?id=6688985935"}
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					ImageTransparency={this.state.transparency}
				>
					{...this.state.indicators}
				</imagelabel>
			</Roact.Fragment>
		);
	}
}
