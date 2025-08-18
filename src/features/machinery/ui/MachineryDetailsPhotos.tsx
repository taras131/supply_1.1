import React, { FC, useState } from "react";
import { fetchDeleteMachineryPhoto, fetchUploadMachineryPhoto } from "../model/actions";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import PhotosManager from "../../../components/common/PhotosManager";
import { nestServerPath } from "../../../api";
import { selectCurrentMachineryPhotos } from "../model/selectors";
import ButtonsEditCancel from "../../../components/common/ButtonsEditCancel";
import Card from "@mui/material/Card";

const MachineryDetailsPhotos: FC = () => {
  const dispatch = useAppDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const photos = useAppSelector(selectCurrentMachineryPhotos);
  if (!photos) return null;
  const toggleIsEditMode = () => {
    setIsEditMode((prev) => !prev);
  };
  const onAddPhoto = (file: File) => {
    dispatch(fetchUploadMachineryPhoto(file));
  };
  const onDeletePhoto = (deletedFileIndex: number) => {
    dispatch(fetchDeleteMachineryPhoto(photos[deletedFileIndex]));
  };
  const photosPaths = photos.map((photo) => `${nestServerPath}/static/${photo}`);
  return (
    <Card
      sx={{
        position: "relative",
        padding: "24px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <PhotosManager
        photosPaths={photosPaths}
        onAddPhoto={onAddPhoto}
        onDeletePhoto={onDeletePhoto}
        isViewingOnly={!isEditMode}
      />
      <ButtonsEditCancel
        isEditMode={isEditMode}
        toggleIsEditMode={toggleIsEditMode}
        cancelUpdateHandler={toggleIsEditMode}
      />
    </Card>
  );
};

export default MachineryDetailsPhotos;
