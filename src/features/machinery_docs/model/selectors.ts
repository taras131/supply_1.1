import { RootState } from "../../../store";
import { createSelector } from "@reduxjs/toolkit";

const selectMachineryDocsState = (state: RootState) => state.machineryDocs;

export const selectAllMachineryDocs = createSelector(
  [selectMachineryDocsState],
  (machineryDocsState) => machineryDocsState.list,
);
