import { userRoles, userStatus } from "../../../models/IUser";

export const getUserRoleById = (roleId: number) => {
  return userRoles.filter((role) => role.id === roleId)[0].title;
};

export const getUserStatus = (statusId: number) => {
  return userStatus.filter((status) => status.id === statusId)[0];
};
