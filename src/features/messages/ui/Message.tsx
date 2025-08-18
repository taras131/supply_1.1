import React from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { selectIsShowMessage, selectMessage } from "../model/selectors";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { resetMessage } from "../model/slice";

const Message = () => {
  const message = useAppSelector(selectMessage);
  const isShowMessage = useAppSelector(selectIsShowMessage);
  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(resetMessage());
  };
  return (
    <Snackbar
      open={isShowMessage}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={message.severity} sx={{ width: "100%" }}>
        {message.text}
      </Alert>
    </Snackbar>
  );
};

export default Message;
