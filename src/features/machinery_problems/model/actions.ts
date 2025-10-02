import {createAsyncThunk} from "@reduxjs/toolkit";
import {filesAPI} from "../../files/api";
import {handlerError} from "../../../store/handleError";
import {machineryProblemsAPI} from "../api";
import {IMachineryProblem, INewMachineryProblem} from "../../../models/IMachineryProblems";
import {RootState} from "../../../store";
import {selectCurrentMachineryId} from "../../machinery/model/selectors";
import {selectCurrentProblem} from "./selectors";
import {updateRelatedProblemInCurrentTask} from "../../machinery_tasks/model/slice";

function cleanProblemForUpdate(problem: IMachineryProblem) {
    const {author, updated_author, ...rest} = problem;
    return rest;
}

export interface IAddProblem {
    newProblem: INewMachineryProblem;
    files: File[];
}

export const fetchAddMachineryProblem = createAsyncThunk<IMachineryProblem, IAddProblem, { state: RootState }>(
    "machinery_problems/add",
    async (addProblemData: IAddProblem, {rejectWithValue, getState}) => {
        try {
            const {newProblem, files} = addProblemData;
            const problem_in = {...newProblem};
            const currentMachineryId =
                newProblem.machinery_id === "-1"
                    ? selectCurrentMachineryId(getState())
                    : newProblem.machinery_id;
            if (files.length > 0) {
                for (const file of files) {
                    const uploadedFile = await filesAPI.upload(file);
                    problem_in.photos.push(uploadedFile);
                }
            }
            return await machineryProblemsAPI.add(currentMachineryId || "", problem_in);
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchGetAllMachineryProblem = createAsyncThunk(
    "machinery_problems/get_all",
    async (_, {rejectWithValue}) => {
        try {
            return await machineryProblemsAPI.getAll();
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchGetMachineryProblemById = createAsyncThunk(
    "machinery_problems/get_by_id",
    async (problemId: string, {rejectWithValue}) => {
        try {
            return await machineryProblemsAPI.getById(problemId);
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchUpdateMachineryProblem = createAsyncThunk(
    "machinery_problems/update",
    async (problem: IMachineryProblem, {rejectWithValue, dispatch}) => {
        try {
            const res = await machineryProblemsAPI.update(cleanProblemForUpdate(problem));
            dispatch(updateRelatedProblemInCurrentTask(res));
            return res;
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchUploadMachineryProblemPhoto = createAsyncThunk<string, FileList, { state: RootState }>(
    "machinery_problems/upload_photo",
    async (files: FileList, {rejectWithValue, dispatch, getState}) => {
        try {
            const problem = selectCurrentProblem(getState());
            if (!problem) return;
            const fileArr = Array.from(files);             // FileList -> File[]
            const uploads = fileArr.map(async (file, i) => {
                const fileName = await filesAPI.upload(file);
                return fileName as string;
            });
            const file_names = await Promise.all(uploads);
            const updatedProblem = {
                ...problem,
                photos: [...problem.photos, ...file_names],
            };
            return dispatch(fetchUpdateMachineryProblem(updatedProblem)).unwrap();
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchDeleteMachineryProblemPhoto = createAsyncThunk<string, string, { state: RootState }>(
    "machinery_problems/delete_photo",
    async (deletePhotoName: string, {rejectWithValue, dispatch, getState}) => {
        try {
            const problem = selectCurrentProblem(getState());
            if (!problem) return;
            const updatedProblem = {
                ...problem,
                photos: [...problem.photos.filter((photo) => photo !== deletePhotoName)],
            };
            await filesAPI.delete(deletePhotoName);
            return dispatch(fetchUpdateMachineryProblem(updatedProblem)).unwrap();
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchDeleteMachineryProblem = createAsyncThunk(
    "machinery_problems/delete",
    async (problemId: string, {rejectWithValue}) => {
        try {
            return await machineryProblemsAPI.delete(problemId);
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);
