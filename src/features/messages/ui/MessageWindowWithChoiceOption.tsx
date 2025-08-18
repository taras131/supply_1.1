import React, { FC } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ModalWindow from "../../../components/ModalWindow";
import { ROW, SPACE_AROUND } from "../../../styles/const";

interface IProps {
  isOpenModal: boolean;
  message: string;
  handleToggleOpen: () => void;
  handleOkClick: () => void;
}

const MessageWindowWithChoiceOption: FC<IProps> = ({ isOpenModal, message, handleToggleOpen, handleOkClick }) => {
  return (
    <ModalWindow handleToggleOpen={handleToggleOpen} isOpenModal={isOpenModal} title={"Внимание"}>
      <Stack spacing={2}>
        <Typography fontSize="20px">{message}</Typography>
        <Stack sx={{ width: "100%" }} direction={ROW} justifyContent={SPACE_AROUND}>
          <Button onClick={handleToggleOpen}>Нет</Button>
          <Button onClick={handleOkClick}>Да</Button>
        </Stack>
      </Stack>
    </ModalWindow>
  );
};

export default MessageWindowWithChoiceOption;
