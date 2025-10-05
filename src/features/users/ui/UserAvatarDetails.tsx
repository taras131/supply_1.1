import React, {FC, useState} from "react";
import ButtonsEditCancel from "../../../components/common/ButtonsEditCancel";
import PhotosManager from "../../../components/common/PhotosManager";
import {useAppDispatch} from "../../../hooks/redux";
import {fileServerPath, nestServerPath} from "../../../api";
import {IUser} from "../../../models/IUser";
import {fetchRemoveUserPhoto, fetchUploadUserPhoto} from "../model/actions";
import {Typography} from "@mui/material";
import CardTemplate from "../../../components/templates/CardTemplate";

interface IProps {
    user: IUser;
}

const UserAvatarDetails: FC<IProps> = ({user}) => {
    const dispatch = useAppDispatch();
    const [isEditMode, setIsEditMode] = useState(false);
    const toggleIsEditMode = () => {
        setIsEditMode((prev) => !prev);
    };
    if (!user) return null;
    const onAddPhotos = (files: FileList) => {
        const file = files[0];
        if(file) {
            dispatch(fetchUploadUserPhoto({user, file: file}));
        }
        toggleIsEditMode();
    };
    const onDeletePhoto = () => {
        dispatch(fetchRemoveUserPhoto(user));
    };
    const photosPaths = user.avatar_path ? [`${fileServerPath}/${user.avatar_path}`] : [];
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
                {user.avatar_path
                    ? "Вы можете заменить текущее фото , загрузив новое"
                    : "Вы можете загрузить фото для аватара"}
            </Typography>
        </CardTemplate>
    );
};

export default UserAvatarDetails;
