import React, {ChangeEvent, FC} from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PerformerChip from "../../features/users/ui/PerformerChip";
import {getUserRoleById} from "../../features/users/utils/services";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import FieldControl from "../common/FieldControl";
import {CardActions, IconButton, SelectChangeEvent} from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import {useAppSelector} from "../../hooks/redux";
import {selectCurrentUser} from "../../features/users/model/selectors";
import {INewInvoiceComment} from "../../models/iInvoiceComment";
import {INewMachineryComment} from "../../models/IMachineryComment";
import {selectAllMachineryForOptions} from "../../features/machinery/model/selectors";

interface IProps {
    editedValue: INewInvoiceComment | INewMachineryComment;
    errors: any;
    handleFieldChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | unknown>) => void;
    isShowMachineryInfo?: boolean;
    saveClickHandler: () => void;
}

const CommentsAddNew: FC<IProps> = ({
                                        editedValue,
                                        errors,
                                        handleFieldChange,
                                        saveClickHandler,
                                        isShowMachineryInfo = false
                                    }) => {
    const currenUser = useAppSelector(selectCurrentUser);
    const machineryOptions = useAppSelector(selectAllMachineryForOptions);

    return (
        <Card
            sx={{
                width: "100%",
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            <CardContent
                sx={{
                    width: "100%",
                    display: "grid",
                    alignItems: "center",
                    padding: "10px",
                    minHeight: "88px",
                    height: "100%",
                    gridTemplateColumns: "120px auto 10fr",
                }}
            >
                <PerformerChip
                    name={currenUser?.first_name || ""}
                    photo={currenUser?.avatar_path || ""}
                    role={getUserRoleById(currenUser?.role_id || 0)}
                />
                <Divider orientation="vertical" flexItem sx={{mx: 2}}/>
                <Box
                    sx={{
                        marginTop: "16px",
                        display: "grid",
                        gridTemplateColumns: "8fr 4fr",
                        gap: "16px",
                    }}>
                    <FieldControl
                        label="Добавить заметку:"
                        name="text"
                        id="text"
                        value={editedValue.text}
                        error={errors?.text}
                        isEditMode
                        onChange={handleFieldChange}
                    />
                    {isShowMachineryInfo && 'machinery_id' in editedValue && (
                        <FieldControl
                            label="Техника"
                            name="machinery_id"
                            id="machinery_id"
                            value={editedValue.machinery_id}
                            error={errors?.machinery_id}
                            onChange={handleFieldChange}
                            options={machineryOptions}
                            sx={{width: "300px"}}
                        />
                    )}
                </Box>
            </CardContent>
            <CardActions>
                <IconButton
                    sx={{marginTop: "16px"}}
                    aria-label="add comment"
                    onClick={saveClickHandler}
                    color={"primary"}
                    disabled={Object.keys(errors).length > 0}
                >
                    <AddCommentIcon/>
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default CommentsAddNew;