import React, {useEffect} from 'react';
import {Button} from "@mui/material";
import {useUploadPaymentFile} from "../../../hooks/useUploadPaymentFile";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectCurrentUser} from "../../users/model/selectors";
import {selectInvoices, selectInvoicesIsLoading} from "../model/selectors";
import {getDateInMilliseconds} from "../../../utils/services";
import {fetchUploadPayment} from "../model/actions";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Tooltip from "@mui/material/Tooltip";
import PaymentUploadResultDialog, {UploadResult} from "./PaymentUploadResultDialog";

const UploadPayments = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
    const invoices = useAppSelector(selectInvoices);
    const loading = useAppSelector(selectInvoicesIsLoading)
    const {
        filesWithAmount,
        onFileChange,
        paymentErrorMessage,
        isLoading,
        resetFiles
    } = useUploadPaymentFile();
    const [results, setResults] = React.useState<UploadResult[]>([]);
    const [openReport, setOpenReport] = React.useState(false);
    useEffect(() => {
        if (!filesWithAmount?.length) return;
        (async () => {
            const usedInvoiceIds = new Set<string>();
            const batch: UploadResult[] = [];
            for (const {file, amount, error, recipient_inn} of filesWithAmount) {
                console.log(recipient_inn)
                if (error) {
                    batch.push({
                        fileName: file.name,
                        amount,
                        status: "error",
                        message: error,
                    });
                    continue;
                }
                const candidates = invoices.filter(
                    (inv) => !inv.paid_is_paid
                        && +inv.amount === +amount
                        && recipient_inn && inv.supplier
                        && +inv.supplier.INN === +recipient_inn
                );
                if (candidates.length === 0) {
                    batch.push({
                        fileName: file.name,
                        amount,
                        status: "error",
                        message: `У поставщика с ИНН ${recipient_inn} нет неоплаченных счетов на сумму ${amount} руб.`,
                    });
                    continue;
                }
                if (candidates.length > 1) {
                    batch.push({
                        fileName: file.name,
                        amount,
                        status: "error",
                        message: `Найдено несколько счетов (${candidates.length}) на сумму ${amount} руб. Уточните, к какому счету прикреплять.`,
                    });
                    continue;
                }
                const candidate = candidates[0];
                if (usedInvoiceIds.has(candidate.id)) {
                    batch.push({
                        fileName: file.name,
                        amount,
                        status: "error",
                        message: `Счёт №${candidate.number} уже обработан в этой загрузке.`,
                    });
                    continue;
                }
                const updatedInvoice = {
                    ...candidate,
                    paid_is_paid: true,
                    paid_date: getDateInMilliseconds(),
                    paid_user_id: user?.id,
                };
                try {
                    await dispatch(
                        fetchUploadPayment({invoice: updatedInvoice, file})
                    ).unwrap(); // важно: .unwrap(), чтобы поймать reject
                    usedInvoiceIds.add(candidate.id);
                    batch.push({
                        fileName: file.name,
                        amount,
                        status: "success",
                        message: `Прикреплено к счёту №${candidate.number}`,
                    });
                } catch (e: any) {
                    const msg = typeof e === "string" ? e : e?.message || "Ошибка прикрепления";
                    batch.push({
                        fileName: file.name,
                        amount,
                        status: "error",
                        message: msg,
                    });
                }
            }
            setResults(batch);
            setOpenReport(true);
            resetFiles();
        })();
    }, [filesWithAmount, invoices, user?.id, dispatch, paymentErrorMessage, resetFiles]);
    return (
        <>
            <Tooltip title="Вы можете загрузить сразу несколько платёжных поручений,
         удерживая ctrl или shift при выборе">
                <Button
                    component="label"
                    loading={isLoading || loading}
                    variant={"contained"}
                    startIcon={<CloudUploadIcon/>}
                    sx={{textTransform: "none"}}
                >
                    {isLoading ? ".....Анализ....." : "Платёжные поручения"}
                    <input type="file"
                           accept="application/pdf, .pdf"
                           hidden
                           onChange={onFileChange}
                           multiple/>
                </Button>
            </Tooltip>
            <PaymentUploadResultDialog
                open={openReport}
                onClose={() => setOpenReport(false)}
                results={results}
            />
        </>
    );
};

export default UploadPayments;