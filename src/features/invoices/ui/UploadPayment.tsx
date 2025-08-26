import {FC, useEffect, useState} from "react";
import {IInvoice} from "../../../models/iInvoices";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {getDateInMilliseconds} from "../../../utils/services";
import {selectCurrentUser} from "../../users/model/selectors";
import {useUploadFile} from "../../../hooks/useUploadFile";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import LoadingButton from "@mui/lab/LoadingButton";
import {LABEL, LOADING_BUTTON_BORDER_RADIUS, SIZE_SMALL} from "../../../styles/const";
import {CANCEL_TEXT, FILE_TYPE, UPLOAD_TEXT} from "../../../utils/const";

interface IProps {
    invoice: IInvoice;
    forDetailsMode?: boolean;
}

const UploadPayment: FC<IProps> = ({ invoice, forDetailsMode = false }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
    const { file, onFileChange, paymentErrorMessage, amount, isLoading, setIsLoading } = useUploadFile();
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const toggleOpen = () => {
        setOpenModal((prev) => !prev);
    };
    const onLoadingPaymentOrderFile = (name: string, filePatch: string) => {
        const newPaid = {
            isPaid: true,
            userId: user?.id || "",
            date: getDateInMilliseconds(),
            paymentOrderFileLink: filePatch,
        };
        /*dispatch(fetchUpdateInvoice({ invoiceId: invoice.id, newPaid: newPaid }));*/
    };
    const uploadFile = () => {
        if (file) {
           /* dispatch(
                fetchUploadFile({
                    file: file,
                    updateFile: onLoadingPaymentOrderFile,
                    setIsUpdateFileLoading: setIsLoading,
                }),
            );*/
        }
    };
    useEffect(() => {
        if (file && !paymentErrorMessage && !isLoading) {
            if (amount === invoice.amount) {
                uploadFile();
            } else {
                setModalMessage(`Обратите внимание, - сумма счёта: ${invoice.amount} руб. 
                Сумма добавляемого платёжного поручения: ${amount} руб. Всё равно продолжить?`);
                setOpenModal(true);
            }
        }
        if (file && paymentErrorMessage && !isLoading) {
            setModalMessage(`${paymentErrorMessage} Всё равно продолжить?`);
            setOpenModal(true);
        }
    }, [file, paymentErrorMessage, amount, isLoading]);
    return (
        <>
            <LoadingButton
                sx={{ borderRadius: forDetailsMode ? 0 : LOADING_BUTTON_BORDER_RADIUS, maxWidth: "150px" }}
                component={LABEL}
                loading={isLoading}
                variant={"contained"}
                fullWidth
                disabled={invoice.cancel_is_cancel}
                size={forDetailsMode ? "medium" : SIZE_SMALL}
                startIcon={invoice.cancel_is_cancel ? <DoDisturbAltIcon /> : <AttachFileIcon />}
            >
                {invoice.cancel_is_cancel ? CANCEL_TEXT : UPLOAD_TEXT}
                <input type={FILE_TYPE}
                       hidden accept="image/*,
                       application/pdf"
                       onChange={onFileChange} />
            </LoadingButton>

        </>
    );
};

export default UploadPayment;
