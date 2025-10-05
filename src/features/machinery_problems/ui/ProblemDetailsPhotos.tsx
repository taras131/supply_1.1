import React, { FC, useState } from "react";
import PhotosManager from "../../../components/common/PhotosManager";
import ButtonsEditCancel from "../../../components/common/ButtonsEditCancel";
import {fileServerPath, nestServerPath} from "../../../api";
import { fetchDeleteMachineryProblemPhoto, fetchUploadMachineryProblemPhoto } from "../model/actions";
import { useAppDispatch } from "../../../hooks/redux";
import Box from "@mui/material/Box";

interface IProps {
  currentProblemPhotos: string[];
}

const ProblemDetailsPhotos: FC<IProps> = ({ currentProblemPhotos }) => {
  const dispatch = useAppDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const toggleIsEditMode = () => {
    setIsEditMode((prev) => !prev);
  };
  const onAddPhotos = (files: FileList) => {
    dispatch(fetchUploadMachineryProblemPhoto(files));
  };
  const onDeletePhoto = (deletedFileIndex: number) => {
    dispatch(fetchDeleteMachineryProblemPhoto(currentProblemPhotos[deletedFileIndex]));
  };
  const photosPaths = currentProblemPhotos?.map((photo) => `${fileServerPath}/${photo}`);
  return (
    <Box sx={{ position: "relative" }}>
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
    </Box>
  );
};

export default ProblemDetailsPhotos;
