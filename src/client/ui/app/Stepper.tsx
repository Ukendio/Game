import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";

interface State {
	count: number;
}

const enum Actions {
	INCREMENT = "increment",
	DECREMENT = "decrement",
}

const initialState: State = {
	count: 0,
};

const reducer: Hooks.Reducer<State, Hooks.Action<Actions>> = (state, action) => {
	switch (action.type) {
		case Actions.INCREMENT:
			return {
				count: state.count + 1,
			};
		case Actions.DECREMENT:
			return {
				count: state.count - 1,
			};
	}
};

const Stepper: Hooks.FC = (_props, { useReducer }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			<uilistlayout
				Key="UIListLayout"
				FillDirection={Enum.FillDirection.Vertical}
				Padding={new UDim(0, 5)}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			<textlabel
				Key="Counters"
				BackgroundTransparency={1}
				Font={Enum.Font.Code}
				LayoutOrder={1}
				Size={new UDim2(1, 0, 0, 38)}
				Text={tostring(state.count)}
				TextColor3={new Color3(0, 1, 0)}
				TextSize={32}
			/>
			<textbutton
				Key="Increment"
				BackgroundColor3={new Color3(0, 1, 0)}
				Font={Enum.Font.Code}
				LayoutOrder={2}
				Size={new UDim2(1, 0, 0, 38)}
				Text="Increment"
				TextColor3={new Color3(1, 1, 1)}
				TextScaled
				Event={{
					Activated: () => {
						dispatch({
							type: Actions.INCREMENT,
						});
					},
				}}
			/>
			<textbutton
				Key="Decrement"
				BackgroundColor3={new Color3(1, 0, 0)}
				Font={Enum.Font.Code}
				LayoutOrder={3}
				Size={new UDim2(1, 0, 0, 38)}
				Text="Decrement"
				TextColor3={new Color3(1, 1, 1)}
				TextScaled
				Event={{
					Activated: () => {
						dispatch({
							type: Actions.DECREMENT,
						});
					},
				}}
			/>
		</frame>
	);
};

export = new Hooks(Roact)(Stepper);
