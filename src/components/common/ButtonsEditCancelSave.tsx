import React, {FC} from "react";
import {IconButton, Stack} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import MyButton from "../../styles/theme/customizations/MyButton";

interface IProps {
    isEditMode: boolean;
    isValid: boolean;
    toggleIsEditMode: () => void;
    updateHandler: () => void;
    cancelUpdateHandler: () => void;
    isLoading?: boolean;
}

const ButtonsEditCancelSave: FC<IProps> = ({
                                               isEditMode,
                                               isValid,
                                               toggleIsEditMode,
                                               updateHandler,
                                               cancelUpdateHandler,
                                               isLoading = false,
                                           }) => {
    return (
        <>
            {isEditMode
                ? (<Stack direction="row"
                          sx={{width: "100%"}}
                          alignItems="center"
                          justifyContent="end"
                          spacing={2}>
                    <MyButton onClick={cancelUpdateHandler}
                              variant={"outlined"}
                              size={"small"}>
                        Отменить
                    </MyButton>
                    <MyButton
                        onClick={updateHandler}
                        variant={"contained"}
                        disabled={!isValid}
                        color={"success"}
                        size={"small"}
                    >
                        Сохранить
                    </MyButton>
                </Stack>)
                : (<IconButton
                    size="large"
                    aria-label="on edit mode"
                    onClick={toggleIsEditMode}
                    sx={{position: "absolute", right: "5px", top: "5px"}}
                >
                    <EditNoteIcon fontSize={"inherit"} color={"inherit"}/>
                </IconButton>)}
        </>
    );
};

export default ButtonsEditCancelSave;
