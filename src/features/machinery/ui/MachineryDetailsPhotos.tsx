import React, {FC} from "react";
import { fetchDeleteMachineryPhoto, fetchUploadMachineryPhoto } from "../model/actions";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { nestServerPath } from "../../../api";
import { selectCurrentMachineryPhotos } from "../model/selectors";
import CardTemplate from "../../../components/templates/CardTemplate";
import {PhotoGallery} from "../../../components/common/PhotoGallery";

const MachineryDetailsPhotos: FC = () => {
  const dispatch = useAppDispatch();
  const photos = useAppSelector(selectCurrentMachineryPhotos) || [];
  const onAddPhotos = (files: FileList) => {
    dispatch(fetchUploadMachineryPhoto(files));
  };
  const onDeletePhoto = (deletedFileIndex: number) => {
    dispatch(fetchDeleteMachineryPhoto(photos[deletedFileIndex]));
  };
  const photosPaths = photos.map((photo) => `${nestServerPath}/static/${photo}`);
  return (
    <CardTemplate>
        <PhotoGallery
            srcArr={photosPaths}
            onUpload={onAddPhotos}
            onDelete={onDeletePhoto}
            height={280}
            emptyStateText="Фотографии пока отсутствуют"
            uploadButtonText="Загрузить фото"
        />
    </CardTemplate>
  );
};

export default MachineryDetailsPhotos;
