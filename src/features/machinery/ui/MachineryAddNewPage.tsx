import React, {useEffect} from "react";
import {Stack} from "@mui/material";
import Button from "@mui/material/Button";
import {useAppDispatch} from "../../../hooks/redux";
import {emptyMachinery, INewMachinery} from "../../../models/iMachinery";
import usePhotoManager from "../../../hooks/usePhotoManager";
import {fetchAddMachinery} from "../model/actions";
import {useNavigate} from "react-router-dom";
import {routes} from "../../../utils/routes";
import {useEditor} from "../../../hooks/useEditor";
import {machineryValidate} from "../../../utils/validators";
import MachineryAdditionalView from "./MachineryAdditionalView";
import MachineryBasicView from "./MachineryBasicView";
import Box from "@mui/material/Box";
import PageTemplate from "../../../components/templates/PageTemplate";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";
import BackButton from "../../../components/common/BackButton";
import {PhotoGallery} from "../../../components/common/PhotoGallery";
import CardTemplate from "../../../components/templates/CardTemplate";
import DetailsGrid from "../../../components/templates/DetailsGrid";

const MachineryAddNewPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {tempFiles, onAddPhotos, onDeletePhoto, clearPhotos} = usePhotoManager();
    const {editedValue, errors, handleFieldChange, resetValue} = useEditor<INewMachinery>({
        initialValue: JSON.parse(JSON.stringify(emptyMachinery)),
        validate: machineryValidate,
    });
    useEffect(() => {
        return () => {
            clearPhotos();
        };
    }, [clearPhotos]);
    const handleAddClick = async () => {
        dispatch(
            fetchAddMachinery({
                newMachinery: editedValue,
                files: tempFiles.map((fileData) => fileData.file),
            }),
        );
        clearPhotos();
        resetValue();
        navigate(routes.machinery);
    };
    return (
        <PageTemplate authOnly>
            <PageHeaderTemplate title={"Новая Техника:"}>
                <Stack direction={"row"} spacing={2}>
                    <BackButton/>
                    <Button
                        onClick={handleAddClick}
                        variant={"contained"}
                        color={"success"}
                        disabled={!!Object.keys(errors).length}
                    >
                        Сохранить
                    </Button>
                </Stack>
            </PageHeaderTemplate>
            <Box
                sx={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(min(500px, 100%), 1fr))",
                    gap: "16px",
                }}
            >
                <CardTemplate title={"Основные сведения:"}>
                    <DetailsGrid>
                        <MachineryBasicView
                            editedMachinery={editedValue}
                            errors={errors}
                            machineryFieldChangeHandler={handleFieldChange}
                            isEditMode
                        />
                    </DetailsGrid>
                </CardTemplate>
                <CardTemplate title={"Дополнительные сведения:"}>
                    <DetailsGrid>
                        <MachineryAdditionalView
                            editedMachinery={editedValue}
                            errors={errors}
                            machineryFieldChangeHandler={handleFieldChange}
                            isEditMode
                        />
                    </DetailsGrid>
                </CardTemplate>
                <CardTemplate title={"Фото:"}>
                    <PhotoGallery
                        srcArr={tempFiles.map((fileData) => fileData.preview)}
                        onUpload={onAddPhotos}
                        onDelete={onDeletePhoto}
                        height={280}
                        emptyStateText="Фотографии пока отсутствуют"
                        uploadButtonText="Загрузить фото"
                    />
                    {/*  <PhotosManager
                        onAddPhoto={onAddPhoto}
                        onDeletePhoto={onDeletePhoto}
                        photosPaths={tempFiles.map((fileData) => fileData.preview)}
                    />*/}
                </CardTemplate>
            </Box>
        </PageTemplate>
    );
};

export default MachineryAddNewPage;
