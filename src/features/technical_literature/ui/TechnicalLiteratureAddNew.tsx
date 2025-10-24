import React, {FC, useState} from 'react';
import {Button, Drawer, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {useEditor} from "../../../hooks/useEditor";
import {emptyProblem} from "../../../models/IMachineryProblems";
import {technicalLiteratureValidate} from "../../../utils/validators";
import {INewTechnicalLiterature} from "../../../models/ITechnicalLiterature";
import {selectTechnicalLiteratureIsLoading} from "../model/selectors";
import {fetchAddTechnicalLiterature} from "../model/actions";
import TechnicalLiteratureView from "./TechnicalLiteratureView";
import {LABEL} from "../../../styles/const";
import CachedIcon from "@mui/icons-material/Cached";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {FILE_TYPE} from "../../../utils/const";

interface IProps {
    isOpen: boolean;
    onClose: (event: any) => void;
}

const TechnicalLiteratureAddNew: FC<IProps> = ({isOpen, onClose}) => {
    const dispatch = useAppDispatch();
    const [tempFile, setTempFile] = useState<File | null>(null);
    const isLoading = useAppSelector(selectTechnicalLiteratureIsLoading)
    const {editedValue, errors, handleFieldChange, setEditedValue, resetValue} = useEditor<INewTechnicalLiterature>({
        initialValue: JSON.parse(JSON.stringify(emptyProblem)),
        validate: technicalLiteratureValidate,
    });
    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const fileName = file.name;
            const fileSize = file.size; // в байтах
            setEditedValue({...editedValue, file_size: fileSize, file_name: fileName});
            setTempFile(file);
        } else {
            setEditedValue({...editedValue, file_size: 0, file_name: ""});
            setTempFile(null);
        }
    };
    const addClickHandler = async () => {
        if (tempFile) {
            await dispatch(fetchAddTechnicalLiterature({
                literature: editedValue,
                file: tempFile
            }))
            resetValue();
            setTempFile(null);
        }
    }
    return (
        <Drawer anchor="right" open={isOpen} onClose={onClose}>
            <Box
                sx={{
                    padding: "16px",
                    maxWidth: "500px",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                }}
            >
                <Typography color="primary" variant="h2" fontSize={"20px"} fontWeight={600} sx={{marginBottom: "8px"}}>
                    Добавить литературу
                </Typography>
                <Button
                    sx={{textTransform: 'none', width: "160px"}}
                    component={LABEL}
                    loading={isLoading}
                    variant={"contained"}
                    fullWidth
                    color={"primary"}
                    startIcon={tempFile
                        ? <CachedIcon/>
                        : <FileUploadIcon/>}
                >
                    {tempFile ? "Заменить файл" : "Добавить файл"}
                    <input type={FILE_TYPE}
                           hidden
                           onChange={fileChangeHandler}/>
                </Button>
                <TechnicalLiteratureView
                    literature={editedValue}
                    errors={errors}
                    fieldChangeHandler={handleFieldChange}
                    isEditMode={true}
                />
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Button onClick={onClose} variant="outlined">
                        Назад
                    </Button>
                    <Button
                        onClick={addClickHandler}
                        variant="contained"
                        color="success"
                        loading={isLoading}
                        disabled={!!Object.keys(errors).length}
                    >
                        Сохранить
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );
};

export default TechnicalLiteratureAddNew;