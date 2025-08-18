import React, { FC } from "react";
import { Modal, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";


interface IProps {
  isOpenModal: boolean;
  title: string;
  handleToggleOpen: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: "6px",
};

const ModalWindow: FC<IProps> = ({ isOpenModal, title, handleToggleOpen, children }) => {
  return (
    <Modal
      open={isOpenModal}
      onClose={handleToggleOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Grid container justifyContent="space-between" alignItems={"center"}>
          <Typography fontSize={"16px"} fontWeight={600}>
            {title}
          </Typography>
          <IconButton aria-label="close" onClick={handleToggleOpen}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "36px",
          }}
        >
          {children}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalWindow;
