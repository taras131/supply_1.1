import React, {FC} from 'react';
import Dialog from "@mui/material/Dialog";
import {DialogActions, DialogContent, DialogTitle, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import MyButton from "../../../styles/theme/customizations/MyButton";
import {EditableSpan} from "../../../components/common/EditableSpan";

interface IProps {
    dialogOpen: boolean,
    closeDialog: () => void,
    onChange: (newValue: number | string) => void
    comment: string
}

const CommentDialog: FC<IProps> = ({dialogOpen, closeDialog, comment, onChange}) => {
    return (
        <Dialog
            open={dialogOpen}
            onClose={closeDialog}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>Примечание</DialogTitle>
            <DialogContent dividers  >
                <Stack sx={{minHeight: 100, height: "100%"}} justifyContent="center">
                    <EditableSpan value={comment}
                                  onChange={onChange}/>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Typography variant={"subtitle2"} color={'text.secondary'}>
                    Кликнете, чтобы изменить
                </Typography>
                <Box flex={1}/>
                <MyButton onClick={closeDialog} variant={"outlined"}>
                    Закрыть
                </MyButton>
            </DialogActions>
        </Dialog>
    );
};

export default CommentDialog;