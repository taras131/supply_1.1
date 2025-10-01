import React, {useMemo, FC, useRef, useState, useCallback} from 'react';
import {Box, Typography, Button} from '@mui/material';
import {Lightbox, useLightboxState} from 'yet-another-react-lightbox';
import Inline from 'yet-another-react-lightbox/plugins/inline';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import ImageIcon from '@mui/icons-material/Image';
import UploadIcon from '@mui/icons-material/Upload';
import FileUploadIcon from "@mui/icons-material/FileUpload";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmModal from "./ConfirmModal";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

interface UploadButtonProps {
    onUpload?: (files: FileList) => void;
    disabled?: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({onUpload, disabled = false}) => {
    const fileRef = useRef<HTMLInputElement | null>(null);

    return (
        <>
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                    if (e.currentTarget.files && onUpload) onUpload(e.currentTarget.files);
                    if (fileRef.current) fileRef.current.value = "";
                }}
            />
            <IconButton
                aria-label="add photos"
                disabled={disabled}
                onClick={() => fileRef.current?.click()}
            >
                <FileUploadIcon/>
            </IconButton>
        </>
    );
};

interface DeleteButtonProps {
    onDelete?: (index: number) => void;
    disabled?: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({onDelete, disabled = false}) => {
    const {currentIndex, slides} = useLightboxState();
    const canDelete = slides && slides.length > 0 && !disabled;

    return (
        <IconButton
            aria-label="delete"
            disabled={!canDelete}
            onClick={() => {
                if (canDelete && onDelete) onDelete(currentIndex);
            }}
        >
            <DeleteIcon/>
        </IconButton>
    );
};

export interface PhotoGalleryProps {
    srcArr: string[];
    onUpload?: (files: FileList) => void;
    onDelete?: (index: number) => void;
    height?: number;
    emptyStateText?: string;
    uploadButtonText?: string;
    readonly?: boolean;
    showCounter?: boolean;
    allowFullscreen?: boolean;
    customToolbarButtons?: React.ReactNode[];
}

export const PhotoGallery: FC<PhotoGalleryProps> = ({
                                                        srcArr,
                                                        onUpload,
                                                        onDelete,
                                                        height = 280,
                                                        emptyStateText = "Фотографии пока отсутствуют",
                                                        uploadButtonText = "Загрузить фото",
                                                        readonly = false,
                                                        showCounter = true,
                                                        allowFullscreen = true,
                                                        customToolbarButtons = []
                                                    }) => {
    const styles = useMemo(() => ({
        container: {backgroundColor: "inherit"}
    }), []);

    const slides = useMemo(
        () =>
            srcArr.filter(Boolean).map((src) => ({
                src,
                alt: "Фото",
                width: 3840,
                height: 2560,
                srcSet: [{src, width: 320, height: 213}],
            })),
        [srcArr]
    );

    const hasPhotos = slides.length > 0;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const openConfirm = useCallback((index: number) => {
        setDeleteIndex(index);
        setModalOpen(true);
    }, []);

    const handleConfirm = useCallback(() => {
        if (deleteIndex !== null && onDelete) onDelete(deleteIndex);
        setModalOpen(false);
        setDeleteIndex(null);
    }, [deleteIndex, onDelete]);

    const handleCancel = useCallback(() => {
        setModalOpen(false);
        setDeleteIndex(null);
    }, []);
    const handleFileUpload = useCallback(() => {
        if (readonly) return;
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true;
        input.onchange = (e: any) => {
            const files = e.target?.files as FileList | null;
            if (files && onUpload) onUpload(files);
        };
        input.click();
    }, [readonly, onUpload]);

    const getToolbarButtons = useCallback(() => {
        const buttons: any[] = [...customToolbarButtons];
        if (!readonly && onDelete) buttons.push(<DeleteButton key="delete"
                                                              onDelete={() => openConfirm(currentIndex)}/>);
        if (!readonly && onUpload) buttons.push(<UploadButton key="upload" onUpload={onUpload}/>);
        if (allowFullscreen) buttons.push("fullscreen");
        return buttons;
    }, [customToolbarButtons, readonly, onDelete, onUpload, allowFullscreen]);

    const getPlugins = useCallback(() => {
        const plugins = [Inline];
        if (allowFullscreen) plugins.push(Fullscreen);
        if (showCounter) plugins.push(Counter);
        return plugins;
    }, [allowFullscreen, showCounter]);

    return (
        <>
            <Box sx={{width: "100%", bgcolor: "background.default", position: "relative"}}>
                {hasPhotos ? (
                    <>
                        <Box sx={{
                            textAlign: "center",
                            mb: 1,
                            position: "absolute",
                            left: "15px",
                            top: "15px",
                            zIndex: 2000
                        }}>
                            <Typography variant="subtitle2">
                                {currentIndex + 1} / {slides.length}
                            </Typography>
                        </Box>
                        <Lightbox
                            slides={slides}
                            plugins={getPlugins()}
                            counter={showCounter ? {
                                container: {style: {top: "unset", bottom: 0}}
                            } : undefined}
                            inline={{style: {width: "100%", height}}}
                            carousel={{imageFit: "contain"}}
                            toolbar={{buttons: getToolbarButtons()}}
                            styles={styles}
                            index={currentIndex}
                            on={{
                                view: ({index}) => setCurrentIndex(index)
                            }}
                        />
                    </>
                ) : (
                    <Box
                        sx={{
                            height,
                            bgcolor: "background.default",
                            color: "text.secondary",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1.5,
                            flexDirection: "column",
                        }}
                    >
                        <ImageIcon fontSize="large"/>
                        <Typography variant="body2" mb={1}>
                            {emptyStateText}
                        </Typography>
                        {!readonly && onUpload && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<UploadIcon/>}
                                onClick={handleFileUpload}
                            >
                                {uploadButtonText}
                            </Button>
                        )}
                    </Box>
                )}
            </Box>
            <ConfirmDeleteDialog
                open={modalOpen}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                title="Удаление фотографии"
                description={"Вы уверены, что хотите удалить фотографию? Это действие нельзя отменить."}
            />
        </>
    );
};