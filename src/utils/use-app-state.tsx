import { createContext, useContext, useEffect, useReducer } from "react";
import {
  ColorKeyIds,
  ControlState,
  InputKeyIds,
  SelectKeyIds,
  SliderKeyIds,
  getDefaultControlState,
} from "../configs/ui/controls";

type ColorAction = {
  type: "color";
  key: keyof ControlState["color"];
  value: string;
};

type SliderAction = {
  type: "slider";
  key: keyof ControlState["slider"];
  value: number;
};

type SelectAction = {
  type: "select";
  key: keyof ControlState["select"];
  value: string;
};

type InputAction = {
  type: "input";
  key: keyof ControlState["input"];
  value: string;
};

type Actions = ColorAction | SliderAction | SelectAction | InputAction;

type StateContextValue = {
  state: ControlState;
  updateColor: (key: ColorKeyIds, value: ColorAction["value"]) => void;
  updateSlider: (key: SliderKeyIds, value: SliderAction["value"]) => void;
  updateSelect: (key: SelectKeyIds, value: SelectAction["value"]) => void;
  updateInput: (key: InputKeyIds, value: InputAction["value"]) => void;
};

export const StateContext = createContext<StateContextValue | undefined>(
  undefined
);

export function StateProvider({ children }: { children: React.ReactNode }) {
  const initialState: ControlState = getDefaultControlState();

  console.log({ initialState });

  const reducer = (state: ControlState, action: Actions): ControlState => {
    switch (action.type) {
      case "color":
        return {
          ...state,
          color: { ...state.color, [action.key]: action.value },
        };
      case "slider":
        return {
          ...state,
          slider: { ...state.slider, [action.key]: action.value },
        };
      case "select":
        return {
          ...state,
          select: { ...state.select, [action.key]: action.value },
        };
      case "input":
        return {
          ...state,
          input: { ...state.input, [action.key]: action.value },
        };
      // default not needed if all cases  are handled(causes type issues)
      // default:
      //   throw new Error(`Unsupported action type: ${action?.type as any}`);
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const updateColor = (
    key: ColorAction["key"],
    value: ColorAction["value"]
  ) => {
    dispatch({ type: "color", key, value });
  };

  const updateSlider = (
    key: SliderAction["key"],
    value: SliderAction["value"]
  ) => {
    dispatch({ type: "slider", key, value });
  };

  const updateSelect = (
    key: SelectAction["key"],
    value: SelectAction["value"]
  ) => {
    dispatch({ type: "select", key, value });
  };

  const updateInput = (
    key: InputAction["key"],
    value: InputAction["value"]
  ) => {
    dispatch({ type: "input", key, value });
  };

  const value = { state, updateColor, updateSlider, updateSelect, updateInput };

  if (!StateContext) return <>{children}</>;

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
}

export function useAppState(
  {
    onStateUpdate,
  }: {
    onStateUpdate?: (state: ControlState) => void;
  } = {
    onStateUpdate: undefined,
  }
) {
  const context = useContext(StateContext);

  useEffect(() => {
    if (!context?.state) return;
    if (!onStateUpdate) return;
    console.log("on state update");
    onStateUpdate(context?.state);
    // cleanup
  }, [context?.state]);

  if (context === undefined) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
}
