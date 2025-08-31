import React, {FC} from "react";
import {Button, ButtonGroup, Stack} from "@mui/material";
import Divider from "@mui/material/Divider";
import TitleWithValue from "../../../components/TitleWithValue";
import {IInvoice} from "../../../models/iInvoices";
import Card from "@mui/material/Card";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {fetchUpdateInvoice} from "../model/actions";
import EditableInput from "../../../components/common/EditableInput";
import EditableSelect from "../../../components/common/EditableSelect";
import DownloadIcon from '@mui/icons-material/Download';
import {selectInvoicesIsLoading} from "../model/selectors";
import UploadPayment from "./UploadPayment";
import UploadInvoice from "./UploadInvoice";

interface IProps {
    invoice: IInvoice | null;
}

const InvoiceDetailsInfo: FC<IProps> = ({invoice}) => {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(selectInvoicesIsLoading)
    const amountChangeHandler = (newValue: number | string) => {
        if (invoice) {
            if (+newValue > 0 && +newValue !== invoice.amount) {
                dispatch(fetchUpdateInvoice({...invoice, amount: +newValue}))
            }
        }
    }
    const numberChangeHandler = (newValue: number | string) => {
        if (invoice) {
            if (newValue && newValue !== invoice.number) {
                dispatch(fetchUpdateInvoice({...invoice, number: `${newValue}`}))
            }
        }
    }
    const withVatChangeHandler = (e: any) => {
        if (invoice) {
            dispatch(fetchUpdateInvoice({...invoice, is_with_vat: e === "a"}))
        }
    }
    const invoiceLink = invoice?.invoice_file_link ?? "";
    const isInvoiceLinkPdf = /\.pdf(\?|#|$)/i.test(invoiceLink);
    const paymentLink = invoice?.paid_payment_order_file_link ?? "";
    const isPaymentLinkPdf = /\.pdf(\?|#|$)/i.test(paymentLink);
    return (
        <Card sx={{padding: "24px"}}>
            <Stack spacing={2}>
                <TitleWithValue title={"Поставщик :"}
                                value={invoice?.supplier?.name ?? "..."}
                                isLoading={isLoading}
                                copyable
                                copyText={invoice?.supplier?.name}/>
                <Divider/>
                <TitleWithValue title={"ИНН :"}
                                value={invoice?.supplier?.INN ?? "..."}
                                isLoading={isLoading}
                                copyable
                                copyText={invoice?.supplier?.INN}/>
                <Divider/>
                <TitleWithValue title={"Счёт № :"}
                                isLoading={isLoading}
                                copyable
                                copyText={invoice?.number}>
                    <EditableInput value={invoice?.number ?? "..."}
                                   onChange={numberChangeHandler}
                                   type={"text"}/>
                </TitleWithValue>
                <Divider/>
                <TitleWithValue title={"Сумма :"}
                                isLoading={isLoading}
                                copyable
                                copyText={`${invoice?.amount}`}>
                    <EditableInput value={invoice?.amount ?? 0}
                                   onChange={amountChangeHandler}
                                   unit_measure={"руб."}
                                   type={"number"}
                    />
                </TitleWithValue>
                <Divider/>
                <TitleWithValue title={"НДС :"}
                                isLoading={isLoading}
                                copyable
                                copyText={`${invoice?.is_with_vat ? "Да" : "Нет"}`}
                >
                    <EditableSelect
                        value={invoice?.is_with_vat ? "a" : "b"}
                        onChange={withVatChangeHandler}
                        options={["a", "b"]}
                        optionLabels={{a: "Да", b: "Нет"}}
                        placeholder="Выберите"
                    />
                </TitleWithValue>
                <Stack direction={"row"} justifyContent={"space-between"} spacing={2} pt={4}>
                    <ButtonGroup>
                        {invoiceLink && (
                            <Button startIcon={<DownloadIcon/>}
                                    href={invoiceLink}
                                    target={isInvoiceLinkPdf ? "_blank" : undefined}
                                    rel={isInvoiceLinkPdf ? "noopener noreferrer" : undefined}
                                    variant={"contained"}
                                    sx={{textTransform: 'none', width: "160px"}}>
                                Скачать счёт
                            </Button>
                        )}
                        <UploadInvoice invoice={invoice}/>
                    </ButtonGroup>
                    <ButtonGroup>
                        {invoice?.paid_payment_order_file_link &&
                            (<Button startIcon={<DownloadIcon/>}
                                     href={paymentLink}
                                     target={isPaymentLinkPdf ? "_blank" : undefined}
                                     rel={isPaymentLinkPdf ? "noopener noreferrer" : undefined}
                                     variant={"contained"}
                                     sx={{textTransform: 'none', width: "160px"}}>
                                Скачать ПП
                            </Button>)}
                        <UploadPayment invoice={invoice}/>
                    </ButtonGroup>
                </Stack>
            </Stack>
        </Card>
    );
};

export default InvoiceDetailsInfo;
