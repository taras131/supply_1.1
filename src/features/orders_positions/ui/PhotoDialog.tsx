import React, {FC} from 'react';
import Dialog from "@mui/material/Dialog";
import {Button, DialogActions, DialogContent, DialogTitle, ImageList, ImageListItem, Tooltip} from "@mui/material";
import Box from "@mui/material/Box";
import {nestServerPath} from "../../../api";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';


interface IProps {
    photoDialogOpen: boolean,
    closeDialog: () => void,
    handleDeletePhoto: (idx: number) => void,
    handleAddFiles: (e: React.ChangeEvent<HTMLInputElement>)=>void,
    photos: string[]
    handleSavePhotos: () => void,
}
const PhotoDialog:FC<IProps> = ({
                                    photoDialogOpen,
                                    closeDialog,
                                    handleDeletePhoto,
                                    handleAddFiles,
                                    photos,
                                    handleSavePhotos
                                }) => {

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    return (
        <Dialog
            open={photoDialogOpen}
            onClose={closeDialog}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>Фотографии позиции</DialogTitle>
            <DialogContent dividers>
                {photos.length === 0 ? (
                    <Box py={4} textAlign="center" color="text.secondary">
                        Нет фотографий
                    </Box>
                ) : (
                    <ImageList cols={4} gap={8} sx={{ mt: 0 }}>
                        {photos.map((src, idx) => (
                            <ImageListItem key={`${src}-${idx}`} sx={{ overflow: 'hidden' }}>
                                <img
                                    src={`${nestServerPath}/static/${src}`}
                                    alt={`Фото ${idx + 1}`}
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <Box
                                    position="absolute"
                                    top={4}
                                    right={4}
                                    bgcolor="rgba(0,0,0,0.5)"
                                    borderRadius={1}
                                >
                                    <Tooltip title="Удалить">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeletePhoto(idx)}
                                        >
                                            <DeleteOutlineIcon htmlColor="#fff" fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </ImageListItem>
                        ))}
                    </ImageList>
                )}
            </DialogContent>
            <DialogActions>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleAddFiles}
                />
                <Button
                    startIcon={<AddPhotoAlternateOutlinedIcon />}
                    onClick={() => fileInputRef.current?.click()}
                >
                    Добавить фото
                </Button>
                <Box flex={1} />
                <Button onClick={closeDialog}>Отмена</Button>
                <Button variant="contained" onClick={handleSavePhotos}>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PhotoDialog;