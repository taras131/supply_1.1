import React, {FC} from 'react';
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import MyButton from "../../../styles/theme/customizations/MyButton";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ConfirmDeleteDialog from "../../../components/common/ConfirmDeleteDialog";
import OrderExcelReader from "./OrderExcelReader";
import {INewOrder} from "../../../models/iOrders";
import {ValidationErrors} from "../../../utils/validators";
import Box from "@mui/material/Box";
import BackButton from "../../../components/common/BackButton";

interface IProps {
    isLoading: boolean;
    saveClickHandler: () => void;
    resetOrder: () => void;
    errors: ValidationErrors;
    setEditedValue: React.Dispatch<React.SetStateAction<INewOrder>>;
}

const OrdersAddNewPageHeader: FC<IProps> = ({
                                                isLoading,
                                                saveClickHandler,
                                                resetOrder,
                                                setEditedValue,
                                                errors
                                            }) => {
    const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
    const openResetDialog = () => {
        setResetDialogOpen(true);
    };
    const closeResetDialog = () => {
        setResetDialogOpen(false);
    };
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
               position={"relative"}>
            <Typography component="h2" variant="h6">
                Новая заявка
            </Typography>
            <Stack direction="row" spacing={1}>
                <BackButton/>
                <MyButton
                    onClick={openResetDialog}
                    startIcon={<RestartAltIcon
                        sx={{
                            fontSize: "var(--icon-fontSize-md)",
                        }}/>}
                    variant="contained"
                    color={"warning"}
                >
                    Сбросить
                </MyButton>
                <OrderExcelReader setEditedValue={setEditedValue}/>
                <MyButton
                    onClick={saveClickHandler}
                    startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                    variant="contained"
                    color={"success"}
                    disabled={Object.keys(errors).length > 0}
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
            {Object.keys(errors).length > 0 && (
                <Box sx={{position: "absolute", right: 5, bottom: -22, zIndex: 3}}>
                    <Typography fontSize={"12px"} color={"text.warning"}>
                        {Object.values(errors)[0] ?? null}
                    </Typography>
                </Box>
            )}
        </Stack>
    );
};

export default OrdersAddNewPageHeader;