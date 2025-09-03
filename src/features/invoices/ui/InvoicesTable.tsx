import React, {FC, memo, useCallback, useEffect, useMemo, useRef} from 'react';
import Box from "@mui/material/Box";
import {MyDataGrid} from "../../../styles/theme/customizations/MyDataGrid";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectInvoices, selectInvoicesIsLoading} from "../model/selectors";
import {GridColDef, GridEventListener} from "@mui/x-data-grid";
import {routes} from "../../../utils/routes";
import {useNavigate} from "react-router-dom";
import {
    convertMillisecondsToDateWithTextMonths,
} from "../../../utils/services";
import {Button, Checkbox, Stack, Typography} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import {CANCEL_TEXT, NO_TEXT} from "../../../utils/const";
import UploadPayment from "./UploadPayment";
import {IInvoice} from "../../../models/iInvoices";
import {selectCurrentUserId} from "../../users/model/selectors";
import {fetchUpdateInvoice, TInvoiceFilter} from "../model/actions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FiberNewIcon from '@mui/icons-material/FiberNew';
import CancelIcon from '@mui/icons-material/Cancel';
import EditableSelect from "../../../components/common/EditableSelect";
import {IShipmentsInvoice, TShipmentInvoiceValue} from "../../../models/iShipments";

const filterOptions: TInvoiceFilter[] = ["all", "only_no_paid", "only_cancel"]
const filterOptionLabels = {all: "Все", only_no_paid: "Не оплаченные", only_cancel: "Отменённые"}

interface IProps {
    selectedInvoicesWithVolume?: IShipmentsInvoice[];
    shipmentMode?: boolean
    newShipmentMode?: boolean
    onToggleChecked?: (invoiceId: string) => void;
    onChangeVolume?: (invoiceId: string, volume: TShipmentInvoiceValue) => void;
    filterValue?: TInvoiceFilter
    filterChangeHandler?: (e: TInvoiceFilter) => void;
}

const InvoicesTable: FC<IProps> = ({
                                       filterValue,
                                       filterChangeHandler,
                                       selectedInvoicesWithVolume,
                                       onChangeVolume,
                                       onToggleChecked,
                                       shipmentMode = false,
                                       newShipmentMode = false,
                                   }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const rows = useAppSelector(selectInvoices)
    const isLoading = useAppSelector(selectInvoicesIsLoading)
    const selectedSetRef = useRef<Set<string>>(new Set());
    const volumeMapRef = useRef<Map<string, TShipmentInvoiceValue>>(new Map());
    useEffect(() => {
        selectedSetRef.current = new Set(
            selectedInvoicesWithVolume?.map(i => i.invoice_id) ?? []
        );
        volumeMapRef.current = new Map(
            selectedInvoicesWithVolume?.map(i => [i.invoice_id, i.volume]) ?? []
        );
    }, [selectedInvoicesWithVolume]);
    const currentUserId = useAppSelector(selectCurrentUserId)
    const volumeOptions = useMemo<TShipmentInvoiceValue[]>(
        () => ["completely", "partly"],
        []);
    const volumeLabels = useMemo(() => ({completely: "Полностью", partly: "Частично"}), []);
    const adaptiveRows = useMemo(() => {
        if (!rows) return [];
        return rows.map((row) => ({
            ...row,
            supplierName: row.supplier?.name ?? "",
            author_date_text: convertMillisecondsToDateWithTextMonths(+row.author_date),
            paid_date_text: row.paid_is_paid && row.paid_date
                ? convertMillisecondsToDateWithTextMonths(+row.paid_date)
                : "",
        }));
    }, [rows]);
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
    const columns = useMemo<GridColDef[]>(() => {
        const base: GridColDef[] = [];
        if (!newShipmentMode && !shipmentMode) {
            base.push({
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
        if (newShipmentMode && onToggleChecked && onChangeVolume) {
            base.push(
                {
                    field: "selected",
                    headerName: "Выбран",
                    type: "boolean",
                    disableColumnMenu: true,
                    sortable: false,
                    align: "center",
                    headerAlign: "center",
                    renderCell: (params: any) => {
                        const isChecked = selectedSetRef.current.has(params.row.id);
                        return (
                            <Checkbox
                                size="small"
                                checked={isChecked}
                                onChange={() => onToggleChecked(params.row.id)}
                                onPointerDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                        );
                    },
                    flex: 0.25,
                },
                {
                    field: "shipment_volume",
                    headerName: "Объём",
                    disableColumnMenu: true,
                    sortable: false,
                    align: "left",
                    headerAlign: "left",
                    renderCell: (params: any) => {
                        if (!selectedSetRef.current.has(params.row.id)) return "—";
                        const volume = volumeMapRef.current.get(params.row.id) ?? "completely";
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
                                    value={volume}
                                    options={volumeOptions as unknown as string[]}
                                    optionLabels={volumeLabels as any}
                                    onChange={(v) => onChangeVolume(params.row.id, v as TShipmentInvoiceValue)}
                                />
                            </Box>
                        );
                    },
                    flex: 0.5,
                }
            );
        }
        base.push(
            {
                field: "author_date_text",
                headerName: "Добавлен",
                disableColumnMenu: true,
                width: 90,
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
                                            : (<FiberNewIcon color={"disabled"}/>)
                                    }
                                    <Typography color={params.row.approved_is_approved
                                        ? "warning"
                                        : "text.disabled"}
                                                fontWeight={600}>
                                        {NO_TEXT}
                                    </Typography>
                                </>)}
                        </Stack>
                    )}
                </Box>),
                width: 120,
            },
            {
                field: "supplierName",
                headerName: "Поставщик",
                disableColumnMenu: true,
                renderCell: (params: any) => (params.row?.supplier?.name),
                sortable: true,
                filterable: true,
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
                width: 140,
            },
        )
        if (!shipmentMode && !shipmentMode) {
            base.push({
                field: "is_with_vat",
                headerName: "НДС",
                disableColumnMenu: true,
                sortable: false,
                renderCell: (params: any) => (params.row.is_with_vat ? "Да" : "Нет"),
                width: 60,
            })
        }
        base.push(
            {
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
            },
        )
        if (!shipmentMode && !shipmentMode) {
            base.push({
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
        if (shipmentMode) {
            base.push({
                field: "volume",
                headerName: "Отгружено",
                disableColumnMenu: true,
                sortable: false,
                align: "center",
                headerAlign: "center",
                renderCell: (params: any) => {
                    if (params.row.volume === "completely") return "Полностью";
                    if (params.row.volume === "partly") return "Частично";
                    return "—";
                },
            });
        }
        return base;
    }, [onToggleApproved,
        shipmentMode,
        newShipmentMode,

        onChangeVolume,
        volumeLabels,
        volumeOptions,
    ])
    return (
        <Box
            sx={{
                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                    outline: "none",
                },
                "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
                    outline: "none",
                },
                position: "relative",
            }}
        >
            {filterChangeHandler && filterValue && (
                <Stack direction={"row"}
                       alignItems={"center"}
                       spacing={2}
                       sx={{position: "absolute", left: 10, top: 10, zIndex: 3}}>
                    <Typography>
                        Показать:
                    </Typography>
                    <EditableSelect
                        value={filterValue}
                        onChange={filterChangeHandler}
                        options={filterOptions}
                        optionLabels={filterOptionLabels}
                        placeholder="Выберите"
                    />
                </Stack>
            )}
            <MyDataGrid
                tableName={"invoices"}
                rows={adaptiveRows}
                columns={columns}
                loading={isLoading}
                onRowClick={handleRowClick}
            />
        </Box>
    );
};

export default memo(InvoicesTable);