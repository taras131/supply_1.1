import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ITechnicalLiterature} from "../../../models/ITechnicalLiterature";
import {fetchAddTechnicalLiterature, fetchGetAllTechnicalLiterature} from "./actions";

interface ITechnicalLiteratureState {
    list: ITechnicalLiterature[];
    isLoading: boolean;
    current: ITechnicalLiterature | null;
}

const handlePending = (state: ITechnicalLiteratureState) => {
    state.isLoading = true;
};

const handleRejected = (state: ITechnicalLiteratureState) => {
    state.isLoading = false;
};

const initialState: ITechnicalLiteratureState = {
    list: [],
    isLoading: false,
    current: null,
};

export const TechnicalLiteratureSlice = createSlice({
    name: "technical_literature_slice",
    initialState,
    reducers: {
        setLiterature: (state, action: PayloadAction<ITechnicalLiterature[]>) => {
            state.list = action.payload;
        },
        setCurrentLiterature: (state, action: PayloadAction<ITechnicalLiterature | null>) => {
            state.current = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddTechnicalLiterature.fulfilled, (state, action: PayloadAction<ITechnicalLiterature>) => {
                state.list = [...state.list, action.payload];
                state.isLoading = false;
            })
            .addCase(fetchGetAllTechnicalLiterature.fulfilled, (state, action: PayloadAction<ITechnicalLiterature[]>) => {
                state.list = action.payload.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                state.isLoading = false;
            })
            .addCase(fetchAddTechnicalLiterature.pending, handlePending)
            .addCase(fetchAddTechnicalLiterature.rejected, handleRejected)
            .addCase(fetchGetAllTechnicalLiterature.pending, handlePending)
            .addCase(fetchGetAllTechnicalLiterature.rejected, handleRejected);
    },
});

export const {setLiterature, setCurrentLiterature} = TechnicalLiteratureSlice.actions;
export default TechnicalLiteratureSlice.reducer;