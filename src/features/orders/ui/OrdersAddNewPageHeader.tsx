import React, {FC} from 'react';
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import MyButton from "../../../styles/theme/customizations/MyButton";
import {useNavigate} from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ConfirmDeleteDialog from "../../../components/common/ConfirmDeleteDialog";

interface IProps {
    isLoading: boolean;
    saveClickHandler: () => void;
    resetOrder: () => void;
}

const OrdersAddNewPageHeader: FC<IProps> = ({isLoading, saveClickHandler, resetOrder}) => {
    const navigate = useNavigate();
    const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
    const openResetDialog = () => {
        setResetDialogOpen(true);
    };
    const closeResetDialog = () => {
        setResetDialogOpen(false);
    };
    const backClickHandler = () => {
        navigate(-1)
    }
    const resetOrderHandler = () => {
        resetOrder();
        setResetDialogOpen(true);
        setResetDialogOpen(false);
    }
    return (
        <Stack direction="row"
               spacing={3}
               justifyContent="space-between"
               alignItems="center"
               sx={{mb: 2, mt: 2}}>
            <Typography component="h2" variant="h6">
                Новая заявка
            </Typography>
            <Stack direction="row" spacing={1}>
                <MyButton
                    onClick={backClickHandler}
                    startIcon={<ArrowBackIosIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                    variant="outlined"
                >
                    Назад
                </MyButton>
                <MyButton
                    onClick={openResetDialog}
                    startIcon={<RestartAltIcon
                        sx={{
                            fontSize: "var(--icon-fontSize-md)",
                            color: "text.warning"
                        }}/>}
                    variant="outlined"
                >
                    Сбросить
                </MyButton>
                <MyButton
                    onClick={saveClickHandler}
                    startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                    variant="contained"
                >
                    Сохранить
                </MyButton>
            </Stack>
            <ConfirmDeleteDialog
                open={resetDialogOpen}
                onClose={closeResetDialog}
                onConfirm={resetOrderHandler}
                title="Сбросить заявку?"
                description={"Вы уверены, что хотите очистить заявку и удалить загруженные фотографии? Это действие нельзя отменить."}
            />
        </Stack>
    );
};

export default OrdersAddNewPageHeader;