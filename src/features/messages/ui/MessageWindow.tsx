import React, { FC } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ModalWindow from "../../../components/ModalWindow";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { selectIsOpenModalMessage, selectModalMessage } from "../model/selectors";
import { resetModalMessage } from "../model/slice";

const MessageWindow: FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsOpenModalMessage);
  const message = useAppSelector(selectModalMessage);
  const handleOkClick = () => {
    dispatch(resetModalMessage());
  };
  return (
    <ModalWindow handleToggleOpen={handleOkClick} isOpenModal={isOpen} title={"Внимание"}>
      <Stack spacing={6}>
        <Typography fontSize="20px" textAlign="center">
          {message}
        </Typography>
        <Button onClick={handleOkClick}>Хорошо</Button>
      </Stack>
    </ModalWindow>
  );
};

export default MessageWindow;
