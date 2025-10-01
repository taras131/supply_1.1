import {useCallback, useState} from "react";

interface IFileWithPreview {
    file: File;
    preview: string;
}

const usePhotoManager = () => {
    const [tempFiles, setTempFiles] = useState<IFileWithPreview[]>([]);

    const onAddPhoto = useCallback((newFile: File) => {
        const preview = URL.createObjectURL(newFile);
        setTempFiles((prev) => [...prev, {file: newFile, preview}]);
    }, []);

    const onAddPhotos = useCallback((files: FileList) => {
        const fileArr = Array.from(files);
        fileArr.forEach((file: File) => {
            const preview = URL.createObjectURL(file);
            setTempFiles((prev) => [...prev, {file: file, preview}]);
        })
    }, []);

    const onDeletePhoto = useCallback((deletedFileIndex: number) => {
        setTempFiles((prev) => {
            const fileToDelete = prev[deletedFileIndex];
            if (fileToDelete) {
                URL.revokeObjectURL(fileToDelete.preview);
            }
            return prev.filter((_, index) => index !== deletedFileIndex);
        });
    }, []);

    const clearPhotos = useCallback(() => {
        setTempFiles((prev) => {
            prev.forEach((fileData) => {
                URL.revokeObjectURL(fileData.preview);
            });
            return [];
        });
    }, []);

    return {
        tempFiles,
        onAddPhoto,
        onAddPhotos,
        onDeletePhoto,
        clearPhotos,
    };
};

export default usePhotoManager;
