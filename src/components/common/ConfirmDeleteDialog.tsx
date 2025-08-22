import * as React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MyButton from "../../styles/theme/customizations/MyButton";

type ConfirmDeleteDialogProps = {
    open: boolean;
    title?: string;
    description?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    disableBackdropClose?: boolean;
    onConfirm: () => void;
    onClose: () => void;
};

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
                                                                     open,
                                                                     title = "Удалить позицию?",
                                                                     description,
                                                                     confirmText = "Удалить",
                                                                     cancelText = "Отмена",
                                                                     loading = false,
                                                                     disableBackdropClose = false,
                                                                     onConfirm,
                                                                     onClose,
                                                                 }) => {
    const handleClose = (
        _e: object,
        reason: "backdropClick" | "escapeKeyDown"
    ) => {
        if (disableBackdropClose && (reason === "backdropClick" || reason === "escapeKeyDown")) {
            return;
        }
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (!loading) onConfirm();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            keepMounted
            onKeyDown={handleKeyDown}
            aria-labelledby="confirm-delete-title"
            aria-describedby="confirm-delete-description"
        >
            <DialogTitle id="confirm-delete-title">
                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <DeleteOutlineIcon color="error"/>
                    {title}
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Typography id="confirm-delete-description" variant="body2">
                    {description ?? "Вы уверены, что хотите удалить эту позицию? Это действие нельзя отменить."}
                </Typography>
            </DialogContent>

            <DialogActions>
                <MyButton onClick={onClose} disabled={loading} variant="outlined">
                    {cancelText}
                </MyButton>
                <MyButton
                    variant="contained"
                    color="warning"
                    onClick={onConfirm}
                    disabled={loading}
                    startIcon={<DeleteOutlineIcon/>}
                    autoFocus
                >
                    {confirmText}
                </MyButton>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;