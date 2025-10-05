import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchCheckAuth, fetchLogin, fetchOut, fetchRegister} from "./actions";
import {IUser} from "../../../models/IUser";

export interface IAuthState {
    isLoading: boolean;
    isAuth: boolean;
    currentUser: IUser | null;
    isAuthChecked: boolean;
}

const initialState: IAuthState = {
    isLoading: false,
    isAuth: false,
    currentUser: null,
    isAuthChecked: false,
};

const handlePending = (state: IAuthState) => {
    state.isLoading = true;
};

const handleRejected = (state: IAuthState) => {
    state.isLoading = false;
};

export const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsAuth: (state, action: PayloadAction<boolean>) => {
            state.isAuth = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogin.fulfilled, (state) => {
                state.isAuth = true;
                state.isLoading = false;
            })
            .addCase(fetchCheckAuth.fulfilled, (state) => {
                state.isAuth = true;
                state.isAuthChecked = true;
                state.isLoading = false;
            })
            .addCase(fetchRegister.fulfilled, (state) => {
                state.isAuth = true;
                state.isLoading = false;
            })
            .addCase(fetchOut.fulfilled, (state) => {
                state.isAuth = false;
                state.isLoading = false;
            })

            .addCase(fetchOut.pending, handlePending)
            .addCase(fetchCheckAuth.pending, handlePending)
            .addCase(fetchOut.rejected, handleRejected)
            .addCase(fetchCheckAuth.rejected, (state) => {
                state.isAuth = false;
                state.isAuthChecked = true;
                state.isLoading = false;
            })
    },
});

export const {setIsAuth} = AuthSlice.actions;
export default AuthSlice.reducer;
