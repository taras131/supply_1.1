import { RootState } from "../../../store";
import { createSelector } from "@reduxjs/toolkit";
import { formatDateDDMMYYYY } from "../../../utils/services";

const selectMachineryProblemsState = (state: RootState) => state.machineryProblems;

export const selectAllMachineryProblems = createSelector(
  [selectMachineryProblemsState],
  (machineryProblemsState) => machineryProblemsState.list,
);

export const selectLastMachineryProblems = createSelector([selectMachineryProblemsState], (machineryProblemsState) =>
  machineryProblemsState.list.slice(0, 3),
);

export const selectMachineryProblemsIsLoading = createSelector(
  [selectMachineryProblemsState],
  (machineryProblemsState) => machineryProblemsState.isLoading,
);

export const selectCurrentProblem = createSelector(
  [selectMachineryProblemsState],
  (machineryProblemsState) => machineryProblemsState.current,
);

export const selectActiveProblemsFromOptions = createSelector(
  [selectMachineryProblemsState],
  (machineryProblemsState) =>
    machineryProblemsState.list
      .filter((problem) => problem.status_id !== 4)
      .map((problem) => ({
        id: problem.id,
        title: `${formatDateDDMMYYYY(problem.created_at)} ${problem.title}`,
      })),
);
