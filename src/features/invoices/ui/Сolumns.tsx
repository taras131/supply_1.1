import {Button, Checkbox, Stack, Typography} from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";
import EditableSelect from "../../../components/common/EditableSelect";
import {TShipmentInvoiceValue} from "../../../models/iShipments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {convertMillisecondsToDateWithTextMonths} from "../../../utils/services";
import {CANCEL_TEXT, NO_TEXT} from "../../../utils/const";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DownloadIcon from "@mui/icons-material/Download";
import {IInvoice} from "../../../models/iInvoices";
import UploadPayment from "./UploadPayment";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import IconWrapper from "../../../components/common/IconWrapper";

export const approvedColumn = (onToggleApproved: (invoice: IInvoice, checked: boolean) => void) => {
    return ({
        field: 'approved_is_approved',
        headerName: 'Одобрен',
        type: 'boolean',
        disableColumnMenu: true,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params: any) => (
            <Checkbox
                checked={Boolean(params.row.approved_is_approved)}
                onChange={(e, checked) => onToggleApproved(params.row, checked)}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
            />
        ),
        width: 80,
    })
}

export const selectedColumn = (onToggleChecked: (invoiceId: string) => void) => {
    return ({
        field: "selected",
        headerName: "Выбран",
        type: "boolean",
        disableColumnMenu: true,
        sortable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params: any) => {
            return (
                <Checkbox
                    size="small"
                    checked={params.row.selected}
                    onChange={() => onToggleChecked(params.row.id)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                />
            );
        },
        width: 90,
    })
}

export const volumeColumn = (onChangeVolume:
                                 (invoiceId: string, volume: TShipmentInvoiceValue) => void) => {
    return ({
        field: "volume",
        headerName: "Объём",
        disableColumnMenu: true,
        sortable: false,
        align: "left",
        headerAlign: "left",
        renderCell: (params: any) => {
            if (!params.row.selected) return null
            const volumeOptions = ["completely", "partly"];
            const volumeLabels = {completely: "Полностью", partly: "Частично"};
            return (
                <Box
                    sx={{width: "100%"}}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    <EditableSelect
                        value={params.row.volume}
                        options={volumeOptions as unknown as string[]}
                        optionLabels={volumeLabels as any}
                        onChange={(v) => onChangeVolume(params.row.id, v as TShipmentInvoiceValue)}
                    />
                </Box>
            );
        },
        width: 90,
    })
}

export const paidColumn = () => {
    return ({
        field: "paid_date_text",
        headerName: "Оплачен",
        disableColumnMenu: true,
        renderCell: (params: any) => (<Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start'
        }}>
            {params.row.paid_is_paid ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircleIcon color={"success"}/>
                    <Typography fontWeight={600} fontSize="14px" color="success">
                        {params.row.paid_date_text}
                    </Typography>
                </Stack>
            ) : (
                <Stack direction="row" alignItems="center" spacing={1}>
                    {params.row.cancel_is_cancel
                        ? (<>
                            <CancelIcon color={"error"}/>
                            <Typography color={"error"} fontWeight={600}>
                                {params.row.cancel_date
                                    ? (convertMillisecondsToDateWithTextMonths(+params.row.cancel_date))
                                    : CANCEL_TEXT}
                            </Typography>
                        </>)
                        : (<>
                            {
                                params.row.approved_is_approved
                                    ? (<AccessTimeIcon color={"warning"}/>)
                                    : (<AccessTimeIcon color={"warning"}/>)
                            }
                            <Typography color={params.row.approved_is_approved
                                ? "warning"
                                : "warning"}
                                        fontWeight={600}>
                                {NO_TEXT}
                            </Typography>
                        </>)}
                </Stack>
            )}
        </Box>),
        width: 120,
    })
}

export const supplierNameColumn = () => {
    return ({
        field: "supplierName",
        headerName: "Поставщик",
        disableColumnMenu: true,
        sortable: true,
        filterable: true,
        flex: 1,
    })
}

export const supplierINNColumn = () => {
    return ({
        field: "supplierINN",
        headerName: "ИНН",
        disableColumnMenu: true,
        sortable: true,
        filterable: true,
    })
}

export const invoiceNumberColumn = () => {
    return ({
        field: "number",
        headerName: "Номер счёта",
        disableColumnMenu: true,
        flex: 0.5,
    })
}

export const authorDateColumn = () => {
    return ({
        field: "author_date_text",
        headerName: "Добавлен",
        disableColumnMenu: true,
        width: 90,
    })
}

export const amountColumn = () => {
    return ({
        field: 'amount',
        headerName: 'Сумма',
        width: 120,
        disableColumnMenu: true,
    })
}

export const withWatColumn = () => {
    return ({
        field: "is_with_vat",
        headerName: "НДС",
        disableColumnMenu: true,
        sortable: false,
        renderCell: (params: any) => (params.row.is_with_vat ? "Да" : "Нет"),
        width: 60,
    })
}

export const invoiceFileLinkColumn = () => {
    return ({
        field: "invoice_file_link",
        headerName: "Счёт",
        disableColumnMenu: true,
        sortable: false,
        renderCell: (params: any) => {
            const invoiceLink = params.row.invoice_file_link ?? "";
            const isInvoiceLinkPdf = /\.pdf(\?|#|$)/i.test(invoiceLink);
            return (
                <Button startIcon={<DownloadIcon/>}
                        size={"small"}
                        href={invoiceLink}
                        target={isInvoiceLinkPdf ? "_blank" : undefined}
                        rel={isInvoiceLinkPdf ? "noopener noreferrer" : undefined}
                        variant={"contained"}
                        color={"success"}
                        sx={{textTransform: 'none'}}>
                    Скачать счёт
                </Button>
            )
        },
        width: 170,
    })
}

export const paymentFileLinkColumn = () => {
    return ({
        field: "payment_invoice_link",
        headerName: "ПП",
        disableColumnMenu: true,
        sortable: false,
        renderCell: (params: any) => {
            const paymentLink = params.row.paid_payment_order_file_link;
            const isPaymentLinkPdf = /\.pdf(\?|#|$)/i.test(paymentLink);
            return (
                <>  {
                    params.row.paid_payment_order_file_link
                        ? (<Button startIcon={<DownloadIcon/>}
                                   size={"small"}
                                   href={paymentLink}
                                   target={isPaymentLinkPdf ? "_blank" : undefined}
                                   rel={isPaymentLinkPdf ? "noopener noreferrer" : undefined}
                                   variant={"contained"}
                                   color={"success"}
                                   sx={{textTransform: 'none', width: "150px"}}>
                            Скачать ПП
                        </Button>)
                        : (<UploadPayment invoice={params.row}/>)
                }
                </>)
        },
        width: 170,
    })
}

export const showVolumeColumn = () => {
    return ({
        field: "volume",
        headerName: "Объём",
        disableColumnMenu: true,
        sortable: false,
        width: 100,
    })
}

export const isShipmentColumn = () => {
    return ({
        field: "isShipment",
        headerName: "",
        disableColumnMenu: true,
        renderCell: (params: any) => (params.row.isShipment
            ? (<IconWrapper>
                <LocalShippingIcon/>
            </IconWrapper>)
            : ""),
        width: 20,
    })
}