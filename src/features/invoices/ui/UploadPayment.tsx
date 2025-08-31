import React, {FC, useCallback, useEffect, useState} from "react";
import {IInvoice} from "../../../models/iInvoices";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {getDateInMilliseconds} from "../../../utils/services";
import {LABEL} from "../../../styles/const";
import {FILE_TYPE} from "../../../utils/const";
import {useUploadPaymentFile} from "../../../hooks/useUploadPaymentFile";
import {selectCurrentUser} from "../../users/model/selectors";
import {fetchUploadPayment} from "../model/actions";
import {Button} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ConfirmDeleteDialog from "../../../components/common/ConfirmDeleteDialog";
import {selectInvoicesIsLoading} from "../model/selectors";

interface IProps {
    invoice: IInvoice | null;
    forDetailsMode?: boolean;
}

const UploadPayment: FC<IProps> = ({invoice, forDetailsMode = false}) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const {
        filesWithAmount,
        onFileChange,
        isLoading,
        resetFiles
    } = useUploadPaymentFile();
    const closeModal = useCallback(() => {
        setModalMessage("")
        setOpenModal(false)
        resetFiles();
    }, [setModalMessage, setOpenModal, resetFiles]);
    const invoiceLoading = useAppSelector(selectInvoicesIsLoading)
    const uploadFile = useCallback((file: File) => {
        if (file && invoice) {
            const updatedInvoice = {
                ...invoice,
                paid_is_paid: true,
                paid_date: getDateInMilliseconds(),
                paid_user_id: user?.id
            }
            dispatch(fetchUploadPayment({invoice: updatedInvoice, file}));
        }
        closeModal();
    }, [dispatch, invoice, user?.id, closeModal]);
    useEffect(() => {
        if (filesWithAmount) {
            const {file, amount, error} = filesWithAmount[0];
            if (amount) {
                if (amount === invoice?.amount) {
                    uploadFile(file);
                    resetFiles();
                } else {
                    setModalMessage(`Обратите внимание, - сумма счёта: ${invoice?.amount} руб. 
                    Сумма добавляемого платёжного поручения: ${amount} руб. Всё равно продолжить?`);
                    setOpenModal(true);
                }
            }
            if (!amount && error) {
                setModalMessage(`Обратите внимание, - ${error}`);
                setOpenModal(true);
            }
        }
    }, [filesWithAmount, invoice, uploadFile, resetFiles]);
    return (
        <>
            <Button
                size={"small"}
                sx={{textTransform: 'none', width: "150px"}}
                component={LABEL}
                loading={isLoading || invoiceLoading}
                variant={"contained"}
                fullWidth
                disabled={invoice?.cancel_is_cancel}
                color={invoice?.paid_payment_order_file_link ? "warning" : "primary"}
                startIcon={invoice?.paid_payment_order_file_link
                    ? <CachedIcon/>
                    : <FileUploadIcon/>}
            >
                {invoice?.paid_payment_order_file_link ? "Заменить ПП" : "Загрузить ПП"}
                <input type={FILE_TYPE} hidden accept="image/*, application/pdf" onChange={onFileChange}/>
            </Button>
            {modalMessage && (
                <ConfirmDeleteDialog
                    open={openModal}
                    onClose={closeModal}
                    onConfirm={() => {
                        if (filesWithAmount) {
                            uploadFile(filesWithAmount[0].file);
                            resetFiles();
                        }
                    }}
                    title="Прикрепить файл?"
                    confirmText="Прикрепить"
                    description={modalMessage}
                />
            )}
        </>
    );
};

export default UploadPayment;