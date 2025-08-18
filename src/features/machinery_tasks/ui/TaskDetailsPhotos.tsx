import React, { FC, useState } from "react";
import PhotosManager from "../../../components/common/PhotosManager";
import { fetchDeleteTaskPhoto, fetchUploadTaskPhoto } from "../model/actions";
import ButtonsEditCancel from "../../../components/common/ButtonsEditCancel";
import { useAppDispatch } from "../../../hooks/redux";
import { nestServerPath } from "../../../api";
import Card from "@mui/material/Card";

interface IProps {
  photos: string[];
  viewType: "issue" | "result";
}

const TaskDetailsPhotos: FC<IProps> = ({ photos, viewType }) => {
  const dispatch = useAppDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const type = viewType === "issue" ? "issue_photos" : "result_photos";
  const toggleIsEditMode = () => {
    setIsEditMode((prev) => !prev);
  };
  const onAddPhoto = (newFile: File) => {
    dispatch(fetchUploadTaskPhoto({ file: newFile, type }));
  };
  const onDeletePhoto = (deletedFileIndex: number) => {
    dispatch(fetchDeleteTaskPhoto({ deletePhotoName: photos[deletedFileIndex], type }));
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

export default TaskDetailsPhotos;
