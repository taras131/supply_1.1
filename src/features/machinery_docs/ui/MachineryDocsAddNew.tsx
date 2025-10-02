import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Backdrop, CardActions, CardMedia, Modal, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { useAppDispatch } from "../../../hooks/redux";
import { styled } from "@mui/material/styles";
import placeholderImage from "../../../assets/images/fileUploadPlaceholder.png";
import PhotosManager from "../../../components/common/PhotosManager";
import FieldControl from "../../../components/common/FieldControl";
import { useEditor } from "../../../hooks/useEditor";
import { docValidate } from "../../../utils/validators";
import usePhotoManager from "../../../hooks/usePhotoManager";
import { emptyMachineryDoc, INewMachineryDoc } from "../../../models/IMachineryDoc";
import { fetchAddMachineryDoc } from "../model/actions";
import { AnimatedCard } from "../../../components/common/AnimatedCard";

const ModalCard = styled(Card)(() => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "600px",
  minHeight: "600px",
  overflow: "auto",
  transition: "all 0.3s ease-in-out",
}));

const MachineryDocsAddNew = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { tempFiles, onAddPhotos, onDeletePhoto, clearPhotos } = usePhotoManager();
  const { editedValue, errors, resetValue, handleFieldChange } = useEditor<INewMachineryDoc>({
    initialValue: emptyMachineryDoc,
    validate: docValidate,
  });
  useEffect(() => {
    return () => clearPhotos();
  }, []);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    clearPhotos();
    resetValue();
  };
  const addDocClickHandler = () => {
    if (tempFiles[0] && Object.keys(errors).length === 0) {
      dispatch(
        fetchAddMachineryDoc({
          doc: editedValue,
          file: tempFiles[0].file,
        }),
      );
    }
    handleClose();
  };
  return (
    <>
      <AnimatedCard sx={{ minWidth: 225 }} onClick={handleOpen}>
        <CardContent>
          <Typography color="primary" variant="h5" component="div" textAlign="center">
            Добавить документ
          </Typography>
          <CardMedia
            component="img"
            height="200"
            image={placeholderImage}
            alt="upload doc"
            sx={{
              objectFit: "contain",
              maxHeight: 200,
            }}
          />
          <Typography sx={{ color: "text.secondary", mb: 1.5 }} textAlign="center">
            Кликните на карточку , чтобы добавить новый документ
          </Typography>
        </CardContent>
      </AnimatedCard>
      <Modal
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{
          backdrop: Backdrop,
        }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <ModalCard sx={{ padding: "24px", position: "relative" }}>
          <CardContent>
            <Stack spacing={4}>
              <Typography color="primary" variant="h5" fontWeight={700} fontSize={"26px"}>
                Добавление нового документа:
              </Typography>
              <PhotosManager
                photosPaths={tempFiles.map((file) => file.preview)}
                onAddPhotos={onAddPhotos}
                onDeletePhoto={onDeletePhoto}
                isViewingOnly={false}
                photosCountLimit={1}
              />
            </Stack>
          </CardContent>
          <CardActions>
            <Stack
              spacing={2}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: "100%" }}
            >
              <FieldControl
                label="Название документа"
                name="title"
                id="title"
                value={editedValue.title}
                error={errors?.title}
                isEditMode={true}
                isRequired
                onChange={handleFieldChange}
              />
              <Button
                variant={"contained"}
                onClick={addDocClickHandler}
                color={"success"}
                disabled={Object.keys(errors).length > 0 || tempFiles.length === 0}
              >
                Добавить
              </Button>
            </Stack>
          </CardActions>
          <Button sx={{ position: "absolute", top: "6px", right: "6px" }} onClick={handleClose}>
            Закрыть
          </Button>
        </ModalCard>
      </Modal>
    </>
  );
};

export default MachineryDocsAddNew;
