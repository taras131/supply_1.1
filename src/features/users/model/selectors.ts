import { RootState } from "../../../store";
import { IUser } from "../../../models/IUser";
import { createSelector } from "@reduxjs/toolkit";

const selectUsersState = (state: RootState) => state.users;

export const selectCurrentUser = createSelector([selectUsersState], (usersState) => usersState.current);

export const selectCurrentUserId = createSelector([selectUsersState], (usersState) => usersState.current?.id);

export const selectCurrentUserEmail = createSelector([selectUsersState], (usersState) => usersState.current?.email);

export const selectAllUsers = createSelector([selectUsersState], (usersState) => usersState.list);

export const selectUsersFromOptions = createSelector([selectUsersState], (usersState) =>
  usersState.list.map((user) => ({ id: user.id, title: `${user.first_name} ${user.middle_name}` })),
);

export const selectIsUsersLoading = createSelector([selectUsersState], (usersState) => usersState.isLoading);

export const selectUserById = createSelector(
  [selectUsersState, (_: any, userId: string | number) => userId],
  (usersState, userId) => usersState.list.find((user: IUser) => user.id === userId),
);

export const getAllUsers = (state: RootState): IUser[] => {
  return state.users.list;
};

export const getUserById = (state: RootState, useId: string): IUser => {
  return state.users.list.filter((user: IUser) => user.id === useId)[0];
};

export const getUserFullNameById = (state: RootState, userId: number): string => {
  return "asd";
};
