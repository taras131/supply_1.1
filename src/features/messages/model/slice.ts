import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage } from "../../../models/iMessage";
import { MESSAGE_SEVERITY } from "../../../utils/const";

interface IMessageState {
  isShow: boolean;
  message: IMessage;
  isOpenModal: boolean;
  modalMessage: string;
}

const initialState: IMessageState = {
  isShow: false,
  message: {
    severity: MESSAGE_SEVERITY.success,
    text: "",
  },
  isOpenModal: false,
  modalMessage: "",
};

export const MessageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<IMessage>) => {
      state.message = action.payload;
      state.isShow = true;
    },
    resetMessage: (state) => {
      state.isShow = false;
      state.message = {
        severity: MESSAGE_SEVERITY.success,
        text: "",
      };
    },
    setModalMessage: (state, action: PayloadAction<string>) => {
      state.modalMessage = action.payload;
      state.isOpenModal = true;
    },
    resetModalMessage: (state) => {
      state.isOpenModal = false;
      state.modalMessage = "";
    },
  },
});

export const { setMessage, resetMessage, setModalMessage, resetModalMessage } = MessageSlice.actions;

export default MessageSlice.reducer;
