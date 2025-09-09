import { RootState } from "../../../store";
import { ICurrentMachinery } from "../../../models/iMachinery";
import { ITask } from "../../../models/IMachineryTasks";
import { createSelector } from "@reduxjs/toolkit";

const collator = new Intl.Collator("ru");

const selectMachineryState = (state: RootState) => state.machinery;

export const selectAllMachinery = createSelector([selectMachineryState], (machineryState) => machineryState.list);

export const selectMachineryIsLoading = createSelector([selectMachineryState], (machineryState) => machineryState.isLoading);

export const selectAllMachineryForOptions = createSelector([selectMachineryState], (machineryState) =>
  machineryState.list.map((machinery) => ({
    id: machinery.id,
    title: `${machinery.brand} ${machinery.model} ${machinery.state_number}`,
  })),
);

export const selectCurrentMachinery = createSelector(
  [selectMachineryState],
  (machineryState) => machineryState.current,
);

export const selectCurrentMachineryId = createSelector(
  [selectMachineryState],
  (machineryState) => machineryState.current?.id,
);

export const selectCurrentMachineryPhotos = createSelector(
  [selectMachineryState],
  (machineryState) => machineryState.current?.photos,
);

export const selectCurrentMachineryTitle = createSelector([selectMachineryState], (machineryState) =>
  machineryState.current ? `${machineryState.current.brand} ${machineryState.current.model}` : "",
);

export const getMachineryIsLoading = (state: RootState): boolean => {
  return state.machinery.isLoading;
};

export const getCurrentMachinery = (state: RootState): ICurrentMachinery | null => {
  return state.machinery.current;
};

export const getCurrentMachineryTitle = (state: RootState): string => {
  const currentMachinery = getCurrentMachinery(state);
  if (currentMachinery) {
    return `${currentMachinery.brand} ${currentMachinery.model}`;
  } else {
    return "";
  }
};
export const getCurrentMachineryOperatingTypeId = (state: RootState): number | null => {
  return state.machinery.current?.operating_type_id || null;
};

export const getTaskById = (state: RootState, taskId: string): ITask | null => {
  return state.machinery.current?.tasks.find((task) => task.id === taskId) || null;
};
