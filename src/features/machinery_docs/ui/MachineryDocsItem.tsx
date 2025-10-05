import React, { FC, useState } from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActions, CardMedia, Box, IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { CENTER } from "../../../styles/const";
import { printImage } from "../../../utils/printUtils";
import {fileServerPath, nestServerPath} from "../../../api";
import { IMachineryDoc } from "../../../models/IMachineryDoc";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useAppDispatch } from "../../../hooks/redux";
import { fetchDeleteMachineryDoc } from "../model/actions";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { AnimatedCard } from "../../../components/common/AnimatedCard";

const Backdrop = styled(Box)(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 999,
  transition: "opacity 0.3s ease-in-out",
}));

interface IProps {
  doc: IMachineryDoc;
}

const MachineryDocsItem: FC<IProps> = ({ doc }) => {
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const photoPath = `${fileServerPath}/${doc.file_name}`;
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
  };
  const dowloadHandler = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(photoPath, { credentials: "include" });
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.file_name || "file.jpg";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      alert("Ошибка загрузки файла");
    }
  };
  const printHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    printImage(photoPath, doc.title);
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(fetchDeleteMachineryDoc(doc));
  };
  const handleOpenConfirmModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpenConfirmModal(true);
  };
  const handleCloseConfirmModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpenConfirmModal(false);
  };
  return (
    <>
      {isExpanded && <Backdrop onClick={handleBackdropClick} />}
      <AnimatedCard expanded={isExpanded} onClick={handleClick} sx={{ zIndex: isExpanded ? 2000 : 100 }}>
        <CardContent>
          <Typography variant="h5" component="div" textAlign={CENTER} sx={{ mb: 2 }}>
            {doc.title}
          </Typography>
          <CardMedia
            component="img"
            image={photoPath}
            alt="upload doc"
            sx={{
              objectFit: "contain",
              height: isExpanded ? "auto" : "200px",
              maxHeight: isExpanded ? "70vh" : "200px",
              width: "100%",
            }}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          <Button size="small" onClick={dowloadHandler}>
            Скачать файл
          </Button>
          <Button size="small" onClick={printHandler}>
            Печать
          </Button>
        </CardActions>
        {!isExpanded && (
          <IconButton onClick={handleOpenConfirmModal} sx={{ position: "absolute", right: "6px", top: "6px" }}>
            <DeleteForeverIcon sx={{ color: "#ff1744" }} />
          </IconButton>
        )}
        <ConfirmModal
          isOpen={isOpenConfirmModal}
          title="Удалить документ?"
          onCancel={handleCloseConfirmModal}
          onConfirm={handleDelete}
        >
          <Typography sx={{ mb: 2, color: "#ff1744" }}>Это действие нельзя отменить. Продолжить удаление?</Typography>
        </ConfirmModal>
      </AnimatedCard>
    </>
  );
};

export default MachineryDocsItem;
