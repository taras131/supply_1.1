import React, {FC, useState} from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoPaginator from "./photoPaginator/photoPaginator";
import {styled} from "@mui/material/styles";
import UploadIcon from "@mui/icons-material/Upload";
import photoPlaceholder from "../../assets/images/placeholder.png";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {Button} from "@mui/material";

const ImageContainer = styled(Box)(({theme}) => ({
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "300px",
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
}));

interface StyledImageProps {
    isAvatar?: boolean;
    src: string;
    alt?: string;
}

const StyledImage = styled("img")<StyledImageProps>(({isAvatar}) => ({
    width: "100%",
    height: "100%",
    objectFit: isAvatar ? "cover" : "contain",
    backgroundColor: "#f0f0f0",
    borderRadius: isAvatar ? "50%" : "8px",
}));

const StyledDeleteButton = styled(Button)(({theme}) => ({
    position: "absolute",
    bottom: 16,
    left: 16,
    padding: 8,
    minWidth: "auto",
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
    "&.MuiLoadingButton-loading": {
        backgroundColor: theme.palette.action.disabledBackground,
    },
    "&:hover": {
        backgroundColor: theme.palette.error.main,
    },
}));

const StyledUploadButton = styled(Button)<{ component?: React.ElementType }>(
    ({theme}) => ({
        position: "absolute",
        bottom: 16,
        right: 16,
        padding: 8,
        minWidth: "auto",
        backgroundColor: theme.palette.success.main,
        "&.MuiLoadingButton-loading": {
            backgroundColor: theme.palette.action.disabledBackground,
        },
        "&:hover": {
            backgroundColor: theme.palette.success.dark,
            color: theme.palette.error.contrastText,
        },
    }),
);

const VisuallyHiddenInput = styled("input")({
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    border: "none",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    clipPath: "inset(50%)",
});

interface IProps {
    photosPaths: string[];
    isViewingOnly?: boolean;
    onAddPhotos?: (files: FileList) => void;
    onDeletePhoto?: (deletedFileIndex: number) => void;
    photosCountLimit?: number;
    isAvatar?: boolean;
}

const PhotosManager: FC<IProps> = ({
                                       photosPaths,
                                       onAddPhotos,
                                       onDeletePhoto,
                                       isViewingOnly = false,
                                       photosCountLimit = 10,
                                       isAvatar = false,
                                   }) => {
    const [activePhoto, setActivePhoto] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const isLoading = false;
    const goToPrevPhoto = () => {
        setActivePhoto((prev) => (prev - 1 + photosPaths.length) % photosPaths.length);
    };
    const goToNextPhoto = () => {
        setActivePhoto((prev) => (prev + 1) % photosPaths.length);
    };

    const photoClickHandler = (photoNumber: number) => {
        setActivePhoto(photoNumber);
    };

    const addPhotoHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!onAddPhotos) return;
        if (e.target.files &&  e.target.files.length > 0) {
            onAddPhotos(e.target.files);
            setActivePhoto(photosPaths.length);
        }
    };

    const deletePhotoHandler = () => {
        if (!onDeletePhoto) return;
        if (!isViewingOnly) {
            setActivePhoto(0);
            onDeletePhoto(activePhoto);
        }
    };

    const handleOpenFullScreen = () => {
        if (isViewingOnly) setIsFullScreen(true);
    };

    const handleCloseFullScreen = () => setIsFullScreen(false);

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            <ImageContainer sx={{aspectRatio: isAvatar ? "1/1" : "16/9"}}>
                <StyledImage
                    isAvatar={isAvatar}
                    src={photosPaths && photosPaths.length > 0 ? photosPaths[activePhoto] : photoPlaceholder}
                    alt="photo"
                    onClick={isViewingOnly ? handleOpenFullScreen : undefined}
                    style={{cursor: isViewingOnly ? "zoom-in" : "default"}}
                />
                {!isViewingOnly && (
                    <>
                        {photosPaths && photosPaths.length > 0 && (
                            <StyledDeleteButton
                                color="error"
                                onClick={deletePhotoHandler}
                                loading={isLoading}
                                loadingIndicator={<CircularProgress size={16} color="inherit"/>}
                            >
                                <DeleteIcon fontSize="small"/>
                            </StyledDeleteButton>
                        )}

                        <StyledUploadButton
                            component="label"
                            variant="contained"
                            tabIndex={-1}
                            disabled={isLoading || (photosPaths && photosPaths.length >= photosCountLimit)}
                        >
                            <UploadIcon fontSize="small"/>
                            <VisuallyHiddenInput
                                type="file"
                                onChange={addPhotoHandler}
                                accept="image/jpeg, image/png, image/jpg"
                                multiple
                            />
                        </StyledUploadButton>
                    </>
                )}
            </ImageContainer>

            {/* Пагинатор */}
            <PhotoPaginator
                activePhoto={activePhoto}
                photoCount={photosPaths?.length || 0}
                onPhotoClick={photoClickHandler}
            />

            {/* Полноэкранный просмотр */}
            <Dialog
                open={isFullScreen}
                onClose={handleCloseFullScreen}
                maxWidth="lg"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundColor: "rgba(0,0,0,0.95)",
                        boxShadow: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    },
                }}
            >
                {/* Стрелки влево/вправо, только если больше одной фотографии */}
                {photosPaths && photosPaths.length > 1 && (
                    <IconButton
                        onClick={goToPrevPhoto}
                        sx={{
                            position: "absolute",
                            left: 4,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#fff",
                            backgroundColor: "rgba(0,0,0,0.4)",
                            zIndex: 10,
                        }}
                    >
                        <ArrowBackIosNewIcon/>
                    </IconButton>
                )}
                {photosPaths && photosPaths.length > 1 && (
                    <IconButton
                        onClick={goToNextPhoto}
                        sx={{
                            position: "absolute",
                            right: 4,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#fff",
                            backgroundColor: "rgba(0,0,0,0.4)",
                            zIndex: 10,
                        }}
                    >
                        <ArrowForwardIosIcon/>
                    </IconButton>
                )}

                <IconButton
                    onClick={handleCloseFullScreen}
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#fff",
                        zIndex: 10,
                    }}
                >
                    <CloseIcon/>
                </IconButton>
                <img
                    src={photosPaths && photosPaths.length > 0 ? photosPaths[activePhoto] : photoPlaceholder}
                    alt="photo"
                    style={{
                        width: "100%",
                        maxHeight: "90vh",
                        objectFit: "contain",
                    }}
                />
                {/* Пагинатор внутри диалога */}
                <Box position="absolute" bottom={24} left={0} width="100%" display="flex" justifyContent="center">
                    <PhotoPaginator
                        activePhoto={activePhoto}
                        photoCount={photosPaths?.length || 0}
                        onPhotoClick={photoClickHandler}
                    />
                </Box>
            </Dialog>
        </Box>
    );
};

export default PhotosManager;
