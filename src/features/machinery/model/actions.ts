import {createAsyncThunk} from "@reduxjs/toolkit";
import {handlerError} from "../../../store/handleError";
import {ICurrentMachinery, IMachinery, INewMachinery} from "../../../models/iMachinery";
import {machineryAPI} from "../api";
import {MESSAGE_SEVERITY} from "../../../utils/const";
import {filesAPI} from "../../files/api";
import {thunkHandlers} from "../../../store/thunkHandlers";
import {AppDispatch, RootState} from "../../../store";
import {selectCurrentMachinery} from "./selectors";
import {setMessage} from "../../messages/model/slice";
import {setDocs} from "../../machinery_docs/model/slice";
import {setProblems} from "../../machinery_problems/model/slice";
import {setTasks} from "../../machinery_tasks/model/slice";
import {setComments} from "../../machinery_comments/model/slice";
import {setOrders} from "../../orders/model/slice";

const messages = {
    addMachinery: {error: "Не удалось добавить машину.", success: "Машина добавлена"},
};

type ThunkConfig = {
    dispatch: AppDispatch;
    rejectValue: string;
};

interface IAddMachinery {
    newMachinery: INewMachinery;
    files: File[];
}

export const fetchAddMachinery = createAsyncThunk<IMachinery, IAddMachinery, ThunkConfig>(
    "machinery/fetchAddMachinery",
    async (addMachineryData, {dispatch, rejectWithValue}) => {
        try {
            const {newMachinery, files} = addMachineryData;
            if (files.length > 0) {
                for (const file of files) {
                    const uploadedFile = await filesAPI.upload(file);
                    newMachinery.photos.push(uploadedFile);
                }
            }
            const res = await machineryAPI.add(newMachinery);
            thunkHandlers.success(messages.addMachinery.success, dispatch);
            return res;
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchGetAllMachinery = createAsyncThunk("machinery/get_all", async (_, {rejectWithValue}) => {
    try {
        return await machineryAPI.getAll();
    } catch (e) {
        return rejectWithValue(handlerError(e));
    }
});

export const fetchGetMachineryById = createAsyncThunk(
    "machinery/get_by_id",
    async (machinery_id: string, {rejectWithValue, dispatch}) => {
        try {
            const {
                docs,
                problems,
                tasks,
                comments,
                orders,
                ...machinery
            } = await machineryAPI.getById(machinery_id);
            dispatch(setDocs(docs));
            dispatch(setProblems(problems));
            dispatch(setTasks(tasks));
            dispatch(setComments(comments));
            console.log(orders)
            dispatch(setOrders(orders));
            return machinery;
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchUpdateMachinery = createAsyncThunk(
    "machinery/update",
    async (machinery: ICurrentMachinery | IMachinery, {rejectWithValue, dispatch}) => {
        try {
            return await machineryAPI.update(machinery);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
            dispatch(
                setMessage({
                    severity: MESSAGE_SEVERITY.error,
                    text: errorMessage || "Не удалось добавить машину.",
                }),
            );
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchUploadMachineryPhoto = createAsyncThunk<ICurrentMachinery, FileList, { state: RootState }>(
    "fetch_update_machinery_photo",
    async (files: FileList, {rejectWithValue, dispatch, getState}) => {
        try {
            const currentMachinery = selectCurrentMachinery(getState());
            if (!currentMachinery) return;
            const fileArr = Array.from(files);             // FileList -> File[]
            const uploads = fileArr.map(async (file, i) => {
                const fileName = await filesAPI.upload(file);
                return fileName as string;
            });
            const file_names = await Promise.all(uploads);

            const updatedMachinery = {
                ...currentMachinery,
                photos: [...currentMachinery.photos, ...file_names]
            };
            return dispatch(fetchUpdateMachinery(updatedMachinery)).unwrap();
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchDeleteMachineryPhoto = createAsyncThunk<ICurrentMachinery, string, { state: RootState }>(
    "fetch_delete_machinery_photo",
    async (deletePhotoName: string, {rejectWithValue, dispatch, getState}) => {
        try {
            const currentMachinery = selectCurrentMachinery(getState());
            if (!currentMachinery) return;
            const res = await filesAPI.delete(deletePhotoName);
            if (!res) return;
            const updatedMachinery = {
                ...currentMachinery,
                photos: [...currentMachinery.photos.filter((photo) => photo !== deletePhotoName)],
            };
            return dispatch(fetchUpdateMachinery(updatedMachinery)).unwrap();
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);
