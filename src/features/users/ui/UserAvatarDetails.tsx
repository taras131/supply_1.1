import React, { FC, useState } from "react";
import ButtonsEditCancel from "../../../components/common/ButtonsEditCancel";
import Card from "@mui/material/Card";
import PhotosManager from "../../../components/common/PhotosManager";
import { useAppDispatch } from "../../../hooks/redux";
import { nestServerPath } from "../../../api";
import { IUser } from "../../../models/IUser";
import { fetchRemoveUserPhoto, fetchUploadUserPhoto } from "../model/actions";
import { Typography } from "@mui/material";

interface IProps {
  user: IUser;
}

const UserAvatarDetails: FC<IProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const toggleIsEditMode = () => {
    setIsEditMode((prev) => !prev);
  };
  if (!user) return null;
  const onAddPhoto = (newFile: File) => {
    dispatch(fetchUploadUserPhoto({ user, file: newFile }));
    toggleIsEditMode();
  };
  const onDeletePhoto = () => {
    dispatch(fetchRemoveUserPhoto(user));
  };
  const photosPaths = user.avatar_path ? [`${nestServerPath}/static/${user.avatar_path}`] : [];
  return (
    <Card
      sx={{
        position: "relative",
        padding: "16px",
      }}
    >
      <PhotosManager
        photosPaths={photosPaths}
        onAddPhoto={onAddPhoto}
        onDeletePhoto={onDeletePhoto}
        isViewingOnly={!isEditMode}
        isAvatar
      />
      <ButtonsEditCancel
        isEditMode={isEditMode}
        toggleIsEditMode={toggleIsEditMode}
        cancelUpdateHandler={toggleIsEditMode}
      />
      <Typography variant={"subtitle2"} textAlign={"center"}>
        {user.avatar_path ? "Вы можете заменить текущее фото , загрузив новое" : "Вы можете загрузить фото для аватара"}
      </Typography>
    </Card>
  );
};

export default UserAvatarDetails;
