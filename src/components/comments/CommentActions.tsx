import React, {useState} from "react";
import {IconButton, Menu, MenuItem, Stack, Typography} from "@mui/material";
import BackspaceIcon from "@mui/icons-material/Backspace";
import SaveIcon from "@mui/icons-material/Save";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import CommentIcon from "@mui/icons-material/Comment";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import {IMachineryComment} from "../../models/IMachineryComment";
import {
    fetchDeleteMachineryComment,
    fetchUpdateMachineryComment
} from "../../features/machinery_comments/model/actions";
import {useAppDispatch} from "../../hooks/redux";
import {IInvoiceComment} from "../../models/iInvoiceComment";
import {fetchDeleteInvoiceComment, fetchUpdateInvoiceComment} from "../../features/invoices_comments/model/actions";

interface IProps<T extends IMachineryComment | IInvoiceComment> {
    comment: T;
    isEdit: boolean;
    disabled: boolean;
    toggleIsEdit: () => void;
    setEditedValue: (value: T) => void;
}

const CommentActions = <T extends IMachineryComment | IInvoiceComment>({
                                                                           comment,
                                                                           isEdit,
                                                                           disabled,
                                                                           toggleIsEdit,
                                                                           setEditedValue
                                                                       }: IProps<T>) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const menuClickHandler = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const deleteHandler = () => {
        if ('machinery_id' in comment) {
            dispatch(fetchDeleteMachineryComment(comment.id));
        }
        if ('invoice_id' in comment) {
            dispatch(fetchDeleteInvoiceComment(comment.id));
        }
    };
    const toggleIsActiveHandler = () => {
        if ('machinery_id' in comment) {
            dispatch(fetchUpdateMachineryComment({...comment, is_active: !comment.is_active}));
        }
        if ('invoice_id' in comment) {
            dispatch(fetchUpdateInvoiceComment({...comment, is_active: !comment.is_active}));
        }
        setAnchorEl(null);
    };
    const cancelClickHandler = () => {
        setAnchorEl(null);
        setEditedValue({...comment});
        toggleIsEdit();
    };
    const saveClickHandler = (e: any) => {
        setAnchorEl(null);
        e.stopPropagation();
        if ('machinery_id' in comment) {
            dispatch(fetchUpdateMachineryComment({...comment}));
        }
        if ('invoice_id' in comment) {
            dispatch(fetchUpdateInvoiceComment({...comment}));
        }
        toggleIsEdit();
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            {isEdit ? (
                <Stack direction="row">
                    <IconButton color="primary" size="large" aria-label="cancel" onClick={cancelClickHandler}>
                        <BackspaceIcon color={"error"}/>
                    </IconButton>
                    <IconButton size="large" aria-label="save" onClick={saveClickHandler} disabled={disabled}>
                        <SaveIcon color={disabled ? "disabled" : "success"}/>
                    </IconButton>
                </Stack>
            ) : (
                <>
                    <IconButton aria-label="more" onClick={menuClickHandler} color={"primary"}>
                        <MoreVertIcon/>
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                        <MenuItem onClick={toggleIsEdit} disableRipple>
                            <Stack direction="row" spacing={1}>
                                <EditIcon color={"primary"}/>
                                <Typography> Редактировать</Typography>
                            </Stack>
                        </MenuItem>
                        <MenuItem onClick={toggleIsActiveHandler} disableRipple>
                            <Stack direction="row" spacing={1}>
                                {comment.is_active ? (
                                    <>
                                        <CommentsDisabledIcon color={"warning"}/>
                                        <Typography>Не актуально</Typography>
                                    </>
                                ) : (
                                    <>
                                        <CommentIcon color={"success"}/>
                                        <Typography>Актуально</Typography>
                                    </>
                                )}
                            </Stack>
                        </MenuItem>
                        <Divider sx={{my: 0.5}}/>
                        <MenuItem onClick={deleteHandler} disableRipple>
                            <Stack direction="row" spacing={1}>
                                <DeleteIcon color={"error"}/>
                                <Typography>Удалить</Typography>
                            </Stack>
                        </MenuItem>
                    </Menu>
                </>
            )}
        </>
    );
};

export default CommentActions;
