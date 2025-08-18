import { RootState } from "../../../store";
import { createSelector } from "@reduxjs/toolkit";

const selectMachineryTasksState = (state: RootState) => state.machineryTasks;

export const selectAllMachineryTasks = createSelector(
  [selectMachineryTasksState],
  (machineryTasksState) => machineryTasksState.list,
);

export const selectLastMachineryRepairTasks = createSelector([selectMachineryTasksState], (machineryTasksState) =>
  machineryTasksState.list.filter((task) => task.type_id === 2).slice(0, 3),
);

export const selectMachineryMaintenanceTasks = createSelector([selectMachineryTasksState], (machineryTasksState) =>
  machineryTasksState.list.filter((task) => task.type_id === 1),
);

export const selectMachineryTasksIsLoading = createSelector(
  [selectMachineryTasksState],
  (machineryTasksState) => machineryTasksState.isLoading,
);

export const selectCurrentTask = createSelector(
  [selectMachineryTasksState],
  (machineryTasksState) => machineryTasksState.current,
);
