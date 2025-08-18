import { RootState } from "../../../store";
import { createSelector } from "@reduxjs/toolkit";

const selectMachineryCommentsState = (state: RootState) => state.machineryComments;

export const selectAllMachineryComments = createSelector([selectMachineryCommentsState],
    (machineryCommentsState) => {
  const active = machineryCommentsState.list.filter((c) => c.is_active !== false);
  const inactive = machineryCommentsState.list.filter((c) => c.is_active === false);
  return [...active, ...inactive];
});
