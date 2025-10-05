import React, { FC, useState } from "react";
import PhotosManager from "../../../components/common/PhotosManager";
import { fetchDeleteTaskPhoto, fetchUploadTaskPhoto } from "../model/actions";
import ButtonsEditCancel from "../../../components/common/ButtonsEditCancel";
import { useAppDispatch } from "../../../hooks/redux";
import {fileServerPath} from "../../../api";
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
  const onAddPhotos = (files: FileList) => {
    dispatch(fetchUploadTaskPhoto({ files: files, type }));
  };
  const onDeletePhoto = (deletedFileIndex: number) => {
    dispatch(fetchDeleteTaskPhoto({ deletePhotoName: photos[deletedFileIndex], type }));
  };
  const photosPaths = photos.map((photo) => `${fileServerPath}/${photo}`);
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
        onAddPhotos={onAddPhotos}
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
