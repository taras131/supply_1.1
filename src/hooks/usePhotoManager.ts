import { useState } from "react";

interface IFileWithPreview {
  file: File;
  preview: string;
}

const usePhotoManager = () => {
  const [tempFiles, setTempFiles] = useState<IFileWithPreview[]>([]);

  const onAddPhoto = (newFile: File) => {
    const preview = URL.createObjectURL(newFile);
    setTempFiles((prev) => [...prev, { file: newFile, preview }]);
  };

  const onDeletePhoto = (deletedFileIndex: number) => {
    setTempFiles((prev) => {
      const fileToDelete = prev[deletedFileIndex];
      if (fileToDelete) {
        URL.revokeObjectURL(fileToDelete.preview);
      }
      return prev.filter((_, index) => index !== deletedFileIndex);
    });
  };

  const clearPhotos = () => {
    setTempFiles((prev) => {
      prev.forEach((fileData) => {
        URL.revokeObjectURL(fileData.preview);
      });
      return [];
    });
  };

  return {
    tempFiles,
    onAddPhoto,
    onDeletePhoto,
    clearPhotos,
  };
};

export default usePhotoManager;
