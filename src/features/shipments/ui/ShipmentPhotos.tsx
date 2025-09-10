import React, {FC, useMemo, useRef} from 'react';
import Lightbox, {useLightboxState} from "yet-another-react-lightbox";
import Inline from "yet-another-react-lightbox/plugins/inline";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import {alpha, Button, Typography, useTheme} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import ImageIcon from "@mui/icons-material/Image";

interface IProps {
    srcArr: string[];
    onUpload?: (files: FileList) => void;     // загрузка новых фото
    onDelete?: (index: number) => void;       // удаление по текущему индексу
}

function UploadButton({onUpload}: { onUpload?: (files: FileList) => void }) {
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
            <IconButton aria-label="add photos"
                        onClick={() => fileRef.current?.click()}
            >
                <FileUploadIcon/>
            </IconButton>
        </>
    );
}

function DeleteButton({onDelete}: { onDelete?: (index: number) => void }) {
    const {currentIndex, slides} = useLightboxState();
    const canDelete = slides && slides.length > 0;
    return (
        <IconButton aria-label="delete"
                    disabled={!canDelete}
                    onClick={() => {
                        if (canDelete && onDelete) onDelete(currentIndex);
                    }}
        >
            <DeleteIcon/>
        </IconButton>
    );
}

export const ShipmentPhotos: FC<IProps> = ({srcArr, onUpload, onDelete}) => {
    const styles = useMemo(() => ({container: {backgroundColor: "inherit"}}), []);
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
    return (
        <Box sx={{
            width: "100%",
            bgcolor: "background.default",
        }}>
            {hasPhotos ? (
                <Lightbox
                    slides={slides}
                    plugins={[Inline, Fullscreen, Counter]}
                    counter={{container: {style: {top: "unset", bottom: 0}}}}
                    inline={{style: {width: "100%", height: 280}}}
                    carousel={{imageFit: "contain"}}
                    toolbar={{
                        buttons: [
                            <DeleteButton key="delete" onDelete={onDelete}/>,
                            <UploadButton key="upload" onUpload={onUpload}/>,
                            "fullscreen",
                        ],
                    }}
                    styles={styles}/>
            ) : (
                <Box
                    sx={{
                        height: 280,
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
                    <Typography variant="body2"  mb={1}>
                        Фотографии пока отсутствуют
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<UploadIcon/>}
                        onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.multiple = true;
                            input.onchange = (e: any) => {
                                const files = e.target?.files as FileList | null;
                                if (files && onUpload) onUpload(files);
                            };
                            input.click();
                        }}
                    >
                        Загрузить фото
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default ShipmentPhotos;