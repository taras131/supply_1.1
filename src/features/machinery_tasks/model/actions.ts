import { RootState } from "../../../store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { filesAPI } from "../../files/api";
import { handlerError } from "../../../store/handleError";
import { setMessage } from "../../messages/model/slice";
import { MESSAGE_SEVERITY } from "../../../utils/const";
import { INewTask, ITask } from "../../../models/IMachineryTasks";
import { machineryTasksAPI } from "../api";
import { selectCurrentTask } from "./selectors";
import { addRelatedTaskToCurrentProblem } from "../../machinery_problems/model/slice";

export interface IAddTask {
  newTask: INewTask;
  files: File[];
}

export const fetchAddMachineryTask = createAsyncThunk<ITask, IAddTask, { state: RootState }>(
  "machinery_tasks/add",
  async (addTaskData: IAddTask, { rejectWithValue, dispatch, getState }) => {
    try {
      const { newTask, files } = addTaskData;
      if (files.length > 0) {
        for (const file of files) {
          const uploadedFile = await filesAPI.upload(file);
          newTask.issue_photos.push(uploadedFile);
        }
      }
      const res = await machineryTasksAPI.add(newTask);
      dispatch(addRelatedTaskToCurrentProblem(res));
      return res;
    } catch (e) {
      return rejectWithValue(handlerError(e));
    }
  },
);

export const fetchGetAllMachineryTasks = createAsyncThunk("machinery_tasks/get_all", async (_, { rejectWithValue }) => {
  try {
    return await machineryTasksAPI.getAll();
  } catch (e) {
    return rejectWithValue(handlerError(e));
  }
});

export const fetchGetMachineryTasksById = createAsyncThunk(
  "machinery_tasks/get_by_id",
  async (task_id: string, { rejectWithValue }) => {
    try {
      return await machineryTasksAPI.getById(task_id);
    } catch (e) {
      return rejectWithValue(handlerError(e));
    }
  },
);

export const fetchUpdateMachineryTask = createAsyncThunk(
  "machinery_tasks/update",
  async (task: ITask, { rejectWithValue, dispatch, getState }) => {
    try {
      return await machineryTasksAPI.update(task);
    } catch (e) {
      return rejectWithValue(handlerError(e));
    }
  },
);

export const fetchDeleteMachineryTask = createAsyncThunk(
  "machinery_tasks/delete",
  async (task_id: string, { rejectWithValue }) => {
    try {
      return await machineryTasksAPI.delete(task_id);
    } catch (e) {
      return rejectWithValue(handlerError(e));
    }
  },
);

interface IUploadTaskPhoto {
  file: File;
  type: "issue_photos" | "result_photos";
}

export const fetchUploadTaskPhoto = createAsyncThunk<ITask, IUploadTaskPhoto, { state: RootState }>(
  "machinery_tasks/upload_photo",
  async (uploadData: IUploadTaskPhoto, { rejectWithValue, dispatch, getState }) => {
    try {
      const { file, type } = uploadData;
      const currentTask = selectCurrentTask(getState());
      if (!currentTask) return;
      const res = await filesAPI.upload(file);
      const updatedTask = { ...currentTask, [type]: [...currentTask[type], res] };
      return dispatch(fetchUpdateMachineryTask(updatedTask)).unwrap();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
      dispatch(
        setMessage({
          severity: MESSAGE_SEVERITY.error,
          text: errorMessage || "Не удалось добавить фото.",
        }),
      );
      return rejectWithValue(handlerError(e));
    }
  },
);

interface IDeleteTaskPhoto {
  deletePhotoName: string;
  type: "issue_photos" | "result_photos";
}

export const fetchDeleteTaskPhoto = createAsyncThunk<ITask, IDeleteTaskPhoto, { state: RootState }>(
  "machinery_tasks/delete_photo",
  async (deleteDate: IDeleteTaskPhoto, { rejectWithValue, dispatch, getState }) => {
    try {
      const { deletePhotoName, type } = deleteDate;
      const currentTask = selectCurrentTask(getState());
      if (!currentTask) return;
      const res = await filesAPI.delete(deletePhotoName);
      const updatedTask = {
        ...currentTask,
        [type]: [...currentTask[type].filter((photo) => photo !== res.name)],
      };
      return dispatch(fetchUpdateMachineryTask(updatedTask)).unwrap();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
      dispatch(
        setMessage({
          severity: MESSAGE_SEVERITY.error,
          text: errorMessage || "Не удалось удалить фото.",
        }),
      );
      return rejectWithValue(handlerError(e));
    }
  },
);
