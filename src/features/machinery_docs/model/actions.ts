import { createAsyncThunk } from "@reduxjs/toolkit";
import { handlerError } from "../../../store/handleError";
import { filesAPI } from "../../files/api";
import { machineryDocsAPI } from "../api";
import { IMachineryDoc, INewMachineryDoc } from "../../../models/IMachineryDoc";
import { selectCurrentMachineryId } from "../../machinery/model/selectors";
import { RootState } from "../../../store";

interface IAddData {
  doc: INewMachineryDoc;
  file: File;
}

export const fetchAddMachineryDoc = createAsyncThunk<IMachineryDoc, IAddData, { state: RootState }>(
  "machinery_docs/add",
  async (addData: IAddData, { rejectWithValue, getState }) => {
    try {
      const currentMachineryId = selectCurrentMachineryId(getState());
      if (!currentMachineryId) return;
      const res = await filesAPI.upload(addData.file);
      if (!res) return;
      return await machineryDocsAPI.add({
        ...addData.doc,
        file_name: res,
        machinery_id: currentMachineryId,
      });
    } catch (e) {
      return rejectWithValue(handlerError(e));
    }
  },
);

export const fetchDeleteMachineryDoc = createAsyncThunk<IMachineryDoc, IMachineryDoc, { state: RootState }>(
  "machinery_docs/delete",
  async (doc: IMachineryDoc, { rejectWithValue }) => {
    try {
      if (doc.file_name) {
        await filesAPI.delete(doc.file_name);
      }
      return await machineryDocsAPI.delete(doc.id);
    } catch (e) {
      return rejectWithValue(handlerError(e));
    }
  },
);
