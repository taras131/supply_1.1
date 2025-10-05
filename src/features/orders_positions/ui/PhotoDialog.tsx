import React, {FC} from 'react';
import Dialog from "@mui/material/Dialog";
import {DialogActions, DialogContent, DialogTitle, ImageList, ImageListItem, Tooltip} from "@mui/material";
import Box from "@mui/material/Box";
import {fileServerPath} from "../../../api";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import MyButton from "../../../styles/theme/customizations/MyButton";


interface IProps {
    dialogOpen: boolean,
    closeDialog: () => void,
    handleDeletePhoto: (src: string) => void,
    handleAddFiles: (e: React.ChangeEvent<HTMLInputElement>) => void,
    photos: string[]
}

const PhotoDialog: FC<IProps> = ({
                                     dialogOpen,
                                     closeDialog,
                                     handleDeletePhoto,
                                     handleAddFiles,
                                     photos,

                                 }) => {

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    console.log(photos)
    return (
        <Dialog
            open={dialogOpen}
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
                    <ImageList cols={4} gap={8} sx={{mt: 0}}>
                        {photos.map((src, idx) => (
                            <ImageListItem key={`${src}-${idx}`} sx={{overflow: 'hidden'}}>
                                <img
                                    src={`${fileServerPath}/${src}`}
                                    alt={`Фото ${idx + 1}`}
                                    loading="lazy"
                                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
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
                                            onClick={() => handleDeletePhoto(src)}
                                        >
                                            <DeleteOutlineIcon htmlColor="#fff" fontSize="small"/>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </ImageListItem>
                        ))}
                    </ImageList>
                )}
            </DialogContent>
            <DialogActions>
                <MyButton onClick={closeDialog} variant={"outlined"}>Закрыть</MyButton>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => {
                        console.log(e)
                        handleAddFiles(e)
                    }}
                />
                <Box flex={1}/>
                <MyButton
                    startIcon={<AddPhotoAlternateOutlinedIcon/>}
                    variant={"contained"}
                    onClick={() => fileInputRef.current?.click()}
                >
                    Добавить фото
                </MyButton>
            </DialogActions>
        </Dialog>
    );
};

export default PhotoDialog;