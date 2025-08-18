import { RootState } from "../../../store";
import { createSelector } from "@reduxjs/toolkit";

const selectMessageState = (state: RootState) => state.message;

export const selectMessage = createSelector([selectMessageState], (messageState) => messageState.message);

export const selectIsShowMessage = createSelector([selectMessageState], (messageState) => messageState.isShow);

export const selectIsOpenModalMessage = createSelector(
  [selectMessageState],
  (messageState) => messageState.isOpenModal,
);

export const selectModalMessage = createSelector([selectMessageState], (messageState) => messageState.modalMessage);
