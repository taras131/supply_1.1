import React, {FC, useState} from 'react';
import {ICompany} from "../../../models/iCompanies";
import CardTemplate from "../../../components/templates/CardTemplate";
import PhotosManager from "../../../components/common/PhotosManager";
import ButtonsEditCancel from "../../../components/common/ButtonsEditCancel";
import {Typography} from "@mui/material";
import {useAppDispatch} from "../../../hooks/redux";
import {fetchRemoveCompanyPhoto, fetchUploadCompanyPhoto} from "../model/actions";
import {fileServerPath} from "../../../api";

interface IProps {
    currentCompany: ICompany;
}

const CompanyAvatarDetails:FC<IProps> = ({currentCompany}) => {
    const dispatch = useAppDispatch();
    const [isEditMode, setIsEditMode] = useState(false);
    const toggleIsEditMode = () => {
        setIsEditMode((prev) => !prev);
    };
    if (!currentCompany) return null;
    const onAddPhotos = (files: FileList) => {
        const file = files[0];
        if(file) {
            dispatch(fetchUploadCompanyPhoto({company: currentCompany, file: file}));
        }
        toggleIsEditMode();
    };
    const onDeletePhoto = () => {
        dispatch(fetchRemoveCompanyPhoto(currentCompany));
    };
    const photosPaths = currentCompany.logo_path ? [`${fileServerPath}/${currentCompany.logo_path}`] : [];
    return (
        <CardTemplate>
            <PhotosManager
                photosPaths={photosPaths}
                onAddPhotos={onAddPhotos}
                onDeletePhoto={onDeletePhoto}
                isViewingOnly={!isEditMode}
                isAvatar
            />
            <ButtonsEditCancel
                isEditMode={isEditMode}
                toggleIsEditMode={toggleIsEditMode}
                cancelUpdateHandler={toggleIsEditMode}
            />
            <Typography variant={"subtitle2"}
                        textAlign={"center"}
                        color={"text.secondary"}>
                {currentCompany.logo_path
                    ? "Вы можете заменить текущее фото , загрузив новое"
                    : "Вы можете загрузить фото для логотипа"}
            </Typography>
        </CardTemplate>
    );
};

export default CompanyAvatarDetails;