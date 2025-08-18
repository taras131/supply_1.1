import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMachineryProblem } from "../../../models/IMachineryProblems";
import {
  fetchAddMachineryProblem,
  fetchDeleteMachineryProblem,
  fetchGetAllMachineryProblem,
  fetchGetMachineryProblemById,
  fetchUpdateMachineryProblem,
} from "./actions";
import { ITask } from "../../../models/IMachineryTasks";

interface IMachineryProblemsState {
  list: IMachineryProblem[];
  isLoading: boolean;
  current: IMachineryProblem | null;
}

const handlePending = (state: IMachineryProblemsState) => {
  state.isLoading = true;
};

const handleRejected = (state: IMachineryProblemsState) => {
  state.isLoading = false;
};

const initialState: IMachineryProblemsState = {
  list: [],
  isLoading: false,
  current: null,
};

export const MachineryProblemsSlice = createSlice({
  name: "machinery_problems_slice",
  initialState,
  reducers: {
    setProblems: (state, action: PayloadAction<IMachineryProblem[]>) => {
      state.list = action.payload;
    },
    setCurrentProblem: (state, action: PayloadAction<IMachineryProblem | null>) => {
      state.current = action.payload;
    },
    addRelatedTaskToCurrentProblem: (state, action: PayloadAction<ITask>) => {
      if (state.current && action.payload.problem_id === state.current.id) {
        state.current = {
          ...state.current,
          tasks: state.current.tasks ? [...state.current.tasks, action.payload] : [action.payload],
          status_id: state.current.status_id === 1 ? 2 : state.current.status_id,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddMachineryProblem.fulfilled, (state, action: PayloadAction<IMachineryProblem>) => {
        state.list = [...state.list, action.payload];
        state.isLoading = false;
      })
      .addCase(fetchGetAllMachineryProblem.fulfilled, (state, action: PayloadAction<IMachineryProblem[]>) => {
        state.list = action.payload.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        state.isLoading = false;
      })
      .addCase(fetchGetMachineryProblemById.fulfilled, (state, action: PayloadAction<IMachineryProblem>) => {
        state.current = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUpdateMachineryProblem.fulfilled, (state, action: PayloadAction<IMachineryProblem>) => {
        state.list = [...state.list.map((problem) => (problem.id === action.payload.id ? action.payload : problem))];
        state.current = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDeleteMachineryProblem.fulfilled, (state, action: PayloadAction<IMachineryProblem>) => {
        state.list = [...state.list.filter((problem) => problem.id !== action.payload.id)];
        state.isLoading = false;
      })
      .addCase(fetchAddMachineryProblem.pending, handlePending)
      .addCase(fetchAddMachineryProblem.rejected, handleRejected)
      .addCase(fetchUpdateMachineryProblem.pending, handlePending)
      .addCase(fetchUpdateMachineryProblem.rejected, handleRejected);
  },
});

export const { setProblems, setCurrentProblem, addRelatedTaskToCurrentProblem } = MachineryProblemsSlice.actions;
export default MachineryProblemsSlice.reducer;
