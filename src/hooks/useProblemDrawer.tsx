import { useState } from "react";
import { IMachineryProblem } from "../models/IMachineryProblems";

export type DrawerMode = "view" | "create";

export interface IDrawerState {
  isOpen: boolean;
  mode: DrawerMode;
  problem: IMachineryProblem | null;
}

const initialState: IDrawerState = {
  isOpen: false,
  mode: "create",
  problem: null,
};

export const useProblemDrawer = (initial = initialState) => {
  const [drawerState, setDrawerState] = useState<IDrawerState>(initial);

  const openDrawer = (mode: DrawerMode, problem: IMachineryProblem | null = null) => {
    setDrawerState({
      isOpen: true,
      mode,
      problem,
    });
  };

  const closeDrawer = () => {
    setDrawerState((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    drawerState,
    openDrawer,
    closeDrawer,
  };
};
