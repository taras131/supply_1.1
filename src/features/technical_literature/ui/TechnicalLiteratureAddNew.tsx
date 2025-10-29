import React, {FC, useState} from 'react';
import {Button, Drawer, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {useEditor} from "../../../hooks/useEditor";
import {technicalLiteratureValidate} from "../../../utils/validators";
import {emptyTechnicalLiterature, INewTechnicalLiterature} from "../../../models/ITechnicalLiterature";
import {selectTechnicalLiteratureIsLoading} from "../model/selectors";
import {fetchAddTechnicalLiterature} from "../model/actions";
import TechnicalLiteratureView from "./TechnicalLiteratureView";
import {LABEL} from "../../../styles/const";
import CachedIcon from "@mui/icons-material/Cached";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {pdfjs} from "react-pdf";
import {FILE_TYPE} from "../../../utils/const";

pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';

async function getPdfPageCount(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(arrayBuffer).promise;
    return pdf.numPages;
}

interface IProps {
    isOpen: boolean;
    onClose: (event: any) => void;
}

const TechnicalLiteratureAddNew: FC<IProps> = ({isOpen, onClose}) => {
    const dispatch = useAppDispatch();
    const [tempFile, setTempFile] = useState<File | null>(null);
    const isLoading = useAppSelector(selectTechnicalLiteratureIsLoading)
    const {editedValue, errors, handleFieldChange, setEditedValue, resetValue} = useEditor<INewTechnicalLiterature>({
        initialValue: JSON.parse(JSON.stringify(emptyTechnicalLiterature)),
        validate: technicalLiteratureValidate,
    });
    const fileChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const fileName = file.name;
            const fileSize = file.size; // в байтах
            const pageCount = await getPdfPageCount(file);
            setEditedValue({
                ...editedValue,
                file_size: fileSize,
                file_name: fileName,
                pages: pageCount
            });
            setTempFile(file);

        } else {
            setEditedValue({...editedValue, file_size: 0, file_name: "", pages: 0});
            setTempFile(null);
        }
    };
    const addClickHandler = async (e: any) => {
        if (tempFile) {
            await dispatch(fetchAddTechnicalLiterature({
                literature: editedValue,
                file: tempFile
            }))
            resetValue();
            setTempFile(null);
            onClose(e);
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
                    gap: "10px",
                }}
            >
                <Stack spacing={1} mt={2} mb={2} sx={{minHeight: "70px"}}>
                    <Stack direction={"row"}
                           alignItems="center"
                           justifyContent={"space-between"}
                           sx={{width: "100%"}}>
                        <Typography variant="h2" fontSize={"20px"} fontWeight={600}>
                            Добавить литературу:
                        </Typography>
                        <Button
                            sx={{textTransform: 'none', width: "180px"}}
                            component={LABEL}
                            loading={isLoading}
                            variant={"contained"}
                            fullWidth
                            color={"primary"}
                            size={"small"}
                            startIcon={tempFile
                                ? <CachedIcon/>
                                : <FileUploadIcon/>}
                        >
                            {tempFile ? "Заменить файл" : "Добавить файл"}
                            <input type={FILE_TYPE}
                                   accept=".pdf,application/pdf"
                                   hidden
                                   onChange={fileChangeHandler}/>
                        </Button>
                    </Stack>
                    {tempFile && tempFile.name && (
                        <Typography variant={"subtitle2"}
                                    textAlign={"end"}
                                    color={"text.secondary"}>
                            {tempFile.name}
                        </Typography>
                    )}
                    {!tempFile && (
                        <Typography variant={"subtitle2"}
                                    textAlign={"end"}
                                    color={"text.warning"}>
                            Загрузите файл.
                        </Typography>
                    )}
                </Stack>
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
                        disabled={!!Object.keys(errors).length || !tempFile}
                    >
                        Сохранить
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );
};

export default TechnicalLiteratureAddNew;