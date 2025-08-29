import React, {useCallback, useMemo} from 'react';
import Box from "@mui/material/Box";
import {MyDataGrid} from "../../../styles/theme/customizations/MyDataGrid";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectInvoices, selectInvoicesIsLoading} from "../model/selectors";
import {GridEventListener} from "@mui/x-data-grid";
import {routes} from "../../../utils/routes";
import {useNavigate} from "react-router-dom";
import {convertMillisecondsToDate, formatDateDDMMYYYY} from "../../../utils/services";
import {COMPONENT_A, SUCCESS} from "../../../styles/const";
import {Button, Checkbox, Chip, Typography} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import {CANCEL_TEXT, NO_TEXT} from "../../../utils/const";
import UploadPayment from "./UploadPayment";
import {IInvoice} from "../../../models/iInvoices";
import {selectCurrentUserId} from "../../users/model/selectors";
import {fetchUpdateInvoice} from "../model/actions";

const InvoicesTable = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const rows = useAppSelector(selectInvoices)
    const isLoading = useAppSelector(selectInvoicesIsLoading)
    const currentUserId = useAppSelector(selectCurrentUserId)
    const onToggleApproved = useCallback((invoice: IInvoice, checked: boolean) => {
        if (!currentUserId) return;
        dispatch(fetchUpdateInvoice({
            ...invoice,
            approved_is_approved: checked,
            approved_user_id: checked ? currentUserId : null,
            approved_date: checked ? Date.now() : 0,
        }));
    }, [dispatch, currentUserId]);
    const handleRowClick = useCallback<GridEventListener<'rowClick'>>(
        (params, event) => {
            const target = event.target as HTMLElement;
            const interactive = target.closest('a, button, [role="button"],' +
                ' .MuiChip-root, [data-interactive="true"]');
            if (interactive) return;
            const me = event as React.MouseEvent;
            if (me.button !== 0 || me.ctrlKey || me.metaKey || me.shiftKey || me.altKey) return;
            navigate(`${routes.invoicesDetails.replace(':invoiceId', params.row.id)}`);
        },
        [navigate],
    );
    const columns = useMemo<any>(
        () => [
            {
                field: 'approved_is_approved',
                headerName: 'Одобрен',
                type: 'boolean',
                disableColumnMenu: true,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: any) => (
                    <Checkbox
                        size="small"
                        checked={Boolean(params.row.approved_is_approved)}
                        onChange={(e, checked) => onToggleApproved(params.row, checked)}
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                ),
                flex: 0.25,
            },
            {
                field: "created_at",
                headerName: "Дата",
                disableColumnMenu: true,
                renderCell: (params: any) => (formatDateDDMMYYYY(params.row.created_at)),
                flex: 0.3,
            },
            {
                field: "supplier",
                headerName: "Поставщик",
                disableColumnMenu: true,
                renderCell: (params: any) => (params.row.supplier.name),
                flex: 1,
            },
            {
                field: "number",
                headerName: "Номер счёта",
                disableColumnMenu: true,
                flex: 0.5,
            },
            {
                field: "amount",
                headerName: "Сумма",
                disableColumnMenu: true,
                flex: 0.5,
            },
            {
                field: "is_with_vat",
                headerName: "НДС",
                disableColumnMenu: true,
                renderCell: (params: any) => (params.row.is_with_vat ? "Да" : "Нет"),
                flex: 0.2,
            },
            {
                field: "paid_is_paid",
                headerName: "Оплачен",
                disableColumnMenu: true,
                renderCell: (params: any) => (<Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {params.row.paid_is_paid ? (
                        convertMillisecondsToDate(+params.row.paid_date)
                    ) : (
                        <Typography color={"warning"}>
                            {params.row.cancel_is_cancel ? CANCEL_TEXT : NO_TEXT}
                        </Typography>
                    )}
                </Box>),
                flex: 0.3,
            },
            {
                field: "invoice_file_link",
                headerName: "Счёт",
                disableColumnMenu: true,
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
            },
            {
                field: "payment_invoice_link",
                headerName: "ПП",
                disableColumnMenu: true,
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
            },
        ],
        [onToggleApproved],
    );


    return (
        <Box
            sx={{
                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                    outline: "none",
                },
                "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
                    outline: "none",
                },

            }}
        >
            <MyDataGrid
                tableName={"invoices"}
                rows={rows}
                columns={columns}
                loading={isLoading}
                onRowClick={handleRowClick}
            />
        </Box>
    );
};

export default InvoicesTable;