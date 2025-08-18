import { RootState } from "../../../store";

export const getNewFileName = (state: RootState): string => {
  return state.files.newFileName;
};

export const getDeletedFileName = (state: RootState): string => {
  return state.files.deletedFileName;
};

export const getFilesIsLoading = (state: RootState): boolean => {
  return state.files.isLoading;
};
