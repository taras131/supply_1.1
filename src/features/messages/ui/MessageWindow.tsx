import React, {FC} from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectIsOpenModalMessage, selectModalMessage} from "../model/selectors";
import {resetModalMessage} from "../model/slice";
import Dialog from "@mui/material/Dialog";
import {DialogActions, DialogContent, DialogTitle} from "@mui/material";
import MyButton from "../../../styles/theme/customizations/MyButton";

const MessageWindow: FC = () => {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(selectIsOpenModalMessage);
    const message = useAppSelector(selectModalMessage);
    const handleOkClick = () => {
        dispatch(resetModalMessage());
    };
    return (
        <Dialog
            open={isOpen}
            onClose={handleOkClick}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle color={'warning'}>Ошибка</DialogTitle>
            <DialogContent dividers>
                <Stack sx={{minHeight: 100, height: "100%"}} justifyContent="center">
                    <Typography fontSize="20px" textAlign="center">
                        {message}
                    </Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <MyButton onClick={handleOkClick} variant={"outlined"}>
                    Закрыть
                </MyButton>
            </DialogActions>
        </Dialog>
    );
};

export default MessageWindow;
