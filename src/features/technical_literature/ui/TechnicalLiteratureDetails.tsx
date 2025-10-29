import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectCurrentTechnicalLiterature} from "../model/selectors";
import {useEditor} from "../../../hooks/useEditor";
import {defaultTechnicalLiterature, ITechnicalLiterature} from "../../../models/ITechnicalLiterature";
import {technicalLiteratureValidate} from "../../../utils/validators";
import {setCurrentLiterature} from "../model/slice";
import {fetchUpdateLiterature} from "../model/actions";
import {Button, Drawer, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import TechnicalLiteratureView from "./TechnicalLiteratureView";
import ButtonsEditCancelSave from "../../../components/common/ButtonsEditCancelSave";
import DownloadIcon from "@mui/icons-material/Download";
import {fileServerPath} from "../../../api";

const TechnicalLiteratureDetails = () => {
    const dispatch = useAppDispatch();
    const [isEditMode, setIsEditMode] = useState(false);
    const literature = useAppSelector(selectCurrentTechnicalLiterature);
    const {editedValue, errors, handleFieldChange, setEditedValue} = useEditor<ITechnicalLiterature>({
        initialValue: JSON.parse(JSON.stringify(literature || defaultTechnicalLiterature)),
        validate: technicalLiteratureValidate,
    });
    useEffect(() => {
        if (literature) {
            setEditedValue(literature);
        }
    }, [literature, setEditedValue]);
    const onClose = () => {
        dispatch(setCurrentLiterature(null));
    };
    const toggleIsEditMode = () => {
        setIsEditMode((prev) => !prev);
    };
    const saveClickHandler = () => {
        if (editedValue) {
            dispatch(fetchUpdateLiterature(editedValue));
            toggleIsEditMode();
        }
    };
    return (
        <Drawer anchor="right" open={!!literature} onClose={onClose}>
            <Box
                sx={{
                    padding: "28px",
                    width: "500px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "24px",
                }}
            >
                {literature && (
                    <>
                        <Stack direction={"row"}
                               alignItems="center"
                               justifyContent={"space-between"}
                               sx={{width: "100%"}}>
                            <Typography variant="h2" fontSize={"20px"} fontWeight={600}>
                                Детали:
                            </Typography>
                            <Button startIcon={<DownloadIcon/>}
                                    size={"small"}
                                    href={`${fileServerPath}/${literature.file_url}`}
                                    variant={"contained"}
                                    color={"success"}
                                    sx={{textTransform: 'none'}}
                                    target="_blank"
                                    rel="noopener noreferrer"
                            >
                                Скачать
                            </Button>
                        </Stack>
                        <Stack spacing={isEditMode ? 2 : 3}
                               sx={{
                                   position: "relative",
                                   paddingTop: "32px",
                                   flexGrow: 1
                               }}>
                            <TechnicalLiteratureView literature={editedValue}
                                                     isEditMode={isEditMode}
                                                     fieldChangeHandler={handleFieldChange}
                                                     errors={errors}/>
                            <ButtonsEditCancelSave
                                isEditMode={isEditMode}
                                isValid={!Object.keys(errors).length}
                                toggleIsEditMode={toggleIsEditMode}
                                updateHandler={saveClickHandler}
                                cancelUpdateHandler={toggleIsEditMode}
                            />
                        </Stack>
                    </>
                )}
            </Box>
        </Drawer>
    );
};

export default TechnicalLiteratureDetails;