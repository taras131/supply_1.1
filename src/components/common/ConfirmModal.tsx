import { Button } from "@mui/material";
import React, { FC } from "react";
import ModalWindow from "../ModalWindow";
import Box from "@mui/material/Box";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  onCancel: (e: React.MouseEvent) => void;
  onConfirm: (e: React.MouseEvent) => void;
  confirmLabel?: string;
  cancelLabel?: string;
  children?: React.ReactNode; // Можно пробрасывать доп. текст/описание
  loading?: boolean;
};

const ConfirmModal: FC<ConfirmModalProps> = ({
  isOpen,
  title,
  onCancel,
  onConfirm,
  confirmLabel = "Подтвердить",
  cancelLabel = "Отмена",
  children,
  loading = false,
}) => (
  <ModalWindow isOpenModal={isOpen} title={title} handleToggleOpen={onCancel}>
    <Box sx={{ my: 2 }}>{children}</Box>
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
      <Button onClick={onCancel} variant="outlined" disabled={loading}>
        {cancelLabel}
      </Button>
      <Button onClick={onConfirm} variant="contained" color="primary" disabled={loading}>
        {confirmLabel}
      </Button>
    </Box>
  </ModalWindow>
);

export default ConfirmModal;
