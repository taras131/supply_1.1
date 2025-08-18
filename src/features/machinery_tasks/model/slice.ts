import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITask } from "../../../models/IMachineryTasks";
import {
  fetchAddMachineryTask,
  fetchDeleteMachineryTask,
  fetchGetAllMachineryTasks,
  fetchGetMachineryTasksById,
  fetchUpdateMachineryTask,
} from "./actions";
import { IMachineryProblem } from "../../../models/IMachineryProblems";

interface IMachineryTasksState {
  list: ITask[];
  isLoading: boolean;
  current: ITask | null;
}

const handlePending = (state: IMachineryTasksState) => {
  state.isLoading = true;
};

const handleRejected = (state: IMachineryTasksState) => {
  state.isLoading = false;
};

const initialState: IMachineryTasksState = {
  list: [],
  isLoading: false,
  current: null,
};

export const MachineryTasksSlice = createSlice({
  name: "machinery_tasks_slice",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<ITask[]>) => {
      state.list = action.payload;
    },
    setCurrentTask: (state, action: PayloadAction<ITask | null>) => {
      state.current = action.payload;
    },
    updateRelatedProblemInCurrentTask: (state, action: PayloadAction<IMachineryProblem>) => {
      if (state.current && action.payload.id === state.current.problem_id) {
        state.current = { ...state.current, problem: action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddMachineryTask.fulfilled, (state, action: PayloadAction<ITask>) => {
        state.list = [...state.list, action.payload];
        state.isLoading = false;
      })
      .addCase(fetchGetAllMachineryTasks.fulfilled, (state, action: PayloadAction<ITask[]>) => {
        state.list = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchGetMachineryTasksById.fulfilled, (state, action: PayloadAction<ITask>) => {
        state.current = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUpdateMachineryTask.fulfilled, (state, action: PayloadAction<ITask>) => {
        state.list = [...state.list.map((task) => (task.id === action.payload.id ? action.payload : task))];
        state.current = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDeleteMachineryTask.fulfilled, (state, action: PayloadAction<ITask>) => {
        state.list = [...state.list.filter((problem) => problem.id !== action.payload.id)];
        state.isLoading = false;
      })
      .addCase(fetchAddMachineryTask.pending, handlePending)
      .addCase(fetchAddMachineryTask.rejected, handleRejected)
      .addCase(fetchUpdateMachineryTask.pending, handlePending)
      .addCase(fetchUpdateMachineryTask.rejected, handleRejected)
      .addCase(fetchDeleteMachineryTask.pending, handlePending)
      .addCase(fetchDeleteMachineryTask.rejected, handleRejected);
  },
});

export const { setTasks, setCurrentTask, updateRelatedProblemInCurrentTask } = MachineryTasksSlice.actions;
export default MachineryTasksSlice.reducer;
