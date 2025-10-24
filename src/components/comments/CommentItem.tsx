import React, {useEffect, useMemo, useState} from 'react';
import {CardActions, ListItem, Stack, Typography} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PerformerChip from "../../features/users/ui/PerformerChip";
import {getUserRoleById} from "../../features/users/utils/services";
import Divider from "@mui/material/Divider";
import FieldControl from "../common/FieldControl";
import {formatDateDDMMYYYY} from "../../utils/services";
import CommentActions from "./CommentActions";
import {IMachineryComment} from "../../models/IMachineryComment";
import {IInvoiceComment} from "../../models/iInvoiceComment";
import {useAppSelector} from "../../hooks/redux";
import {selectCurrentUserId} from "../../features/users/model/selectors";
import {useEditor} from "../../hooks/useEditor";
import {commentValidate} from "../../utils/validators";

interface IProps<T extends IMachineryComment | IInvoiceComment> {
    comment: T;
    isShowMachineryInfo?: boolean;
}

const CommentItem = <T extends IMachineryComment
    | IInvoiceComment>({
                           comment,
                           isShowMachineryInfo = false
                       }: IProps<T>) => {
    const [isEdit, setIsEdit] = useState(false);
    const currenUserId = useAppSelector(selectCurrentUserId);
    const memoizedInitialValue = useMemo(
        () => comment,
        [comment]
    );
    const validate = useMemo(() => commentValidate<T>(isShowMachineryInfo), [isShowMachineryInfo]);
    const {editedValue, errors, handleFieldChange, setEditedValue} = useEditor<T>({
        initialValue: memoizedInitialValue,
        validate: validate,
    });
    useEffect(() => {
        setEditedValue(comment);
    }, [setEditedValue, comment])
    const toggleIsEdit = () => {
        setIsEdit((prev) => !prev);
    };
    return (
        <ListItem disablePadding sx={{border: "none", background: "none"}}>
            <Card
                sx={{
                    width: "100%",
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: comment.is_active ? 1 : 0.4,
                }}
            >
                <CardContent
                    sx={{
                        width: "100%",
                        display: "grid",
                        alignItems: "center",
                        padding: isEdit ? "8px 10px" : "10px",
                        minHeight: "88px",
                        height: "100%",
                        gridTemplateColumns: "120px auto 10fr",
                    }}
                >
                    <PerformerChip
                        name={comment.author?.first_name || ""}
                        photo={comment.author?.avatar_path || ""}
                        role={getUserRoleById(comment.author?.role_id || 0)}
                    />
                    <Divider orientation="vertical" flexItem sx={{mx: 2}}/>
                    {isEdit ? (
                        <FieldControl
                            label=""
                            name="text"
                            id="text"
                            value={editedValue.text}
                            error={errors?.text}
                            isEditMode
                            onChange={handleFieldChange}
                            sx={{marginTop: "8px"}}
                        />
                    ) : (
                        <Stack justifyContent={"center"}>
                            <Typography variant="body1">{comment.text}</Typography>
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                sx={{
                                    fontSize: 12,
                                    position: "absolute",
                                    bottom: "10px",
                                    right: "60px",
                                }}
                            >
                                {comment.updated_at !== comment.created_at
                                    ? `изменено: ${formatDateDDMMYYYY(comment.updated_at)}`
                                    : `добавлено: ${formatDateDDMMYYYY(comment.created_at)}`}
                            </Typography>
                            {'machinery' in comment && comment.machinery && isShowMachineryInfo && (
                                <Typography
                                    variant="caption"
                                    color="textSecondary"
                                    sx={{
                                        fontSize: 12,
                                        position: "absolute",
                                        bottom: "10px",
                                        left: "162px",
                                    }}
                                >
                                    {`${comment.machinery.brand} ${comment.machinery.model}`}
                                </Typography>
                            )}
                        </Stack>
                    )}
                </CardContent>
                <CardActions>
                    {currenUserId === comment.author_id && (
                        <CommentActions<T>
                            comment={editedValue}
                            isEdit={isEdit}
                            toggleIsEdit={toggleIsEdit}
                            disabled={editedValue.text === comment.text || Object.keys(errors).length > 0}
                            setEditedValue={setEditedValue}
                        />
                    )}
                </CardActions>
            </Card>
        </ListItem>
    );
};

export default CommentItem;