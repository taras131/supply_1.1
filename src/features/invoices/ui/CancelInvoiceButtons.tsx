import React, {FC, useCallback, useRef, useState} from 'react';
import {Button, Stack} from "@mui/material";
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import DeleteIcon from '@mui/icons-material/Delete';
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectInvoicesIsLoading} from "../model/selectors";
import ConfirmDeleteDialog from "../../../components/common/ConfirmDeleteDialog";
import {fetchDeletePayment, fetchUpdateInvoice} from "../model/actions";
import {IInvoice} from "../../../models/iInvoices";
import {selectCurrentUserId} from "../../users/model/selectors";
import {getDateInMilliseconds} from "../../../utils/services";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

interface IProps {
    invoice: IInvoice;
}

const CancelInvoiceButtons: FC<IProps> = ({invoice}) => {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(selectInvoicesIsLoading);
    const userId = useAppSelector(selectCurrentUserId);
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const confirmActionRef = useRef<null | (() => void | Promise<void>)>(null);
    const closeModal = useCallback(() => {
        setModalMessage("")
        setOpenModal(false)
        confirmActionRef.current = null;
    }, [setModalMessage, setOpenModal, confirmActionRef]);
    const deletePayment = useCallback(() => {
        dispatch(fetchDeletePayment(invoice))
    }, [dispatch, invoice])
    const cancelInvoice = useCallback(() => {
        dispatch(fetchUpdateInvoice({
            ...invoice,
            cancel_is_cancel: true,
            cancel_date: getDateInMilliseconds(),
            cancel_user_id: userId,
        }))
    }, [dispatch, invoice, userId])
    const continueInvoice = useCallback(() => {
        dispatch(fetchUpdateInvoice({
            ...invoice,
            cancel_is_cancel: false,
            cancel_date: 0,
            cancel_user_id: null,
            cancel_user: null,
        }))
    }, [dispatch, invoice])
    const deletePaymentClickHandler = useCallback(() => {
        confirmActionRef.current = deletePayment;
        setModalMessage("Вы действительно хотите удалить платёжное поручение?")
        setOpenModal(true)
    }, [setModalMessage, setOpenModal, deletePayment])
    const cancelInvoiceClickHandler = useCallback(() => {
        confirmActionRef.current = cancelInvoice;
        setModalMessage("Вы действительно хотите отменить счёт?")
        setOpenModal(true)
    }, [setModalMessage, setOpenModal, cancelInvoice])
    const continueInvoiceClickHandler = useCallback(() => {
        confirmActionRef.current = continueInvoice;
        setModalMessage("Вы действительно хотите восстановить счёт?")
        setOpenModal(true)
    }, [setModalMessage, setOpenModal, continueInvoice])
    return (
        <Stack spacing={2}>
            {invoice.paid_payment_order_file_link && (
                <Button startIcon={<DeleteIcon/>}
                        onClick={deletePaymentClickHandler}
                        variant={"contained"}
                        color={"warning"}
                        loading={isLoading}
                        sx={{textTransform: 'none', width: "180px"}}>
                    Удалить ПП
                </Button>
            )}
            {invoice.cancel_is_cancel
                ? (<Button startIcon={<ArrowRightIcon/>}
                           onClick={continueInvoiceClickHandler}
                           variant={"contained"}
                           color={"primary"}
                           loading={isLoading}
                           sx={{textTransform: 'none', width: "180px"}}>
                    Возобновить счёт
                </Button>)
                : (
                    <Button startIcon={<CancelPresentationIcon/>}
                            onClick={cancelInvoiceClickHandler}
                            variant={"contained"}
                            color={"error"}
                            loading={isLoading}
                            sx={{textTransform: 'none', width: "180px"}}>
                        Отменить счёт
                    </Button>)}
            {confirmActionRef.current && (
                <ConfirmDeleteDialog
                    open={openModal}
                    onClose={closeModal}
                    onConfirm={confirmActionRef.current}
                    title={"Внимание"}
                    confirmText="Да"
                    description={modalMessage}
                />
            )}
        </Stack>
    );
};

export default CancelInvoiceButtons;