import React, { FC } from "react";
import { IconButton, Stack } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import BackspaceIcon from "@mui/icons-material/Backspace";
interface IProps {
  isEditMode: boolean;
  toggleIsEditMode: () => void;
  cancelUpdateHandler: () => void;
  isLoading?: boolean;
}

const ButtonsEditCancel: FC<IProps> = ({ isEditMode, toggleIsEditMode, cancelUpdateHandler, isLoading = false }) => {
  return (
    <Stack direction="row" sx={{ width: "100%" }} alignItems="center" justifyContent="end" spacing={2}>
      {isEditMode ? (
        <IconButton
          size="large"
          aria-label="off edit mode"
          onClick={cancelUpdateHandler}
          sx={{ position: "absolute", right: "5px", top: "5px" }}
        >
          <BackspaceIcon fontSize={"inherit"} color={"secondary"} />
        </IconButton>
      ) : (
        <IconButton
          color="primary"
          size="large"
          aria-label="on edit mode"
          onClick={toggleIsEditMode}
          sx={{ position: "absolute", right: "5px", top: "5px" }}
        >
          <EditNoteIcon fontSize={"inherit"} color={"inherit"} />
        </IconButton>
      )}
    </Stack>
  );
};

export default ButtonsEditCancel;
