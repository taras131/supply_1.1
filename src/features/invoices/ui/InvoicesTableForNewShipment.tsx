import React, {FC, memo, useMemo} from 'react';
import {MyDataGrid} from "../../../styles/theme/customizations/MyDataGrid";
import {IShipmentsInvoice, TShipmentInvoiceValue} from "../../../models/iShipments";
import Box from "@mui/material/Box";
import {useAppSelector} from "../../../hooks/redux";
import {selectInvoices, selectInvoicesIsLoading} from "../model/selectors";
import {convertMillisecondsToDateWithTextMonths} from "../../../utils/services";
import {
    amountColumn,
    authorDateColumn,
    invoiceFileLinkColumn,
    invoiceNumberColumn,
    paidColumn,
    selectedColumn,
    supplierNameColumn,
    volumeColumn
} from "../../shipments/ui/Сolumns";

interface IProps {
    selectedInvoicesWithVolume: IShipmentsInvoice[];
    onToggleChecked: (invoiceId: string) => void;
    onChangeVolume: (invoiceId: string, volume: TShipmentInvoiceValue) => void;
}

const InvoicesTableForNewShipment: FC<IProps> = ({
                                                     selectedInvoicesWithVolume,
                                                     onToggleChecked,
                                                     onChangeVolume,
                                                 }) => {
        const rows = useAppSelector(selectInvoices)
        const isLoading = useAppSelector(selectInvoicesIsLoading)
        const adaptiveRows = useMemo(() => {
            if (!rows) return [];
            return rows.map((row) => ({
                ...row,
                selected: selectedInvoicesWithVolume.some(i => i.invoice_id === row.id),
                volume: selectedInvoicesWithVolume.find(i => i.invoice_id === row.id)?.volume || "",
                supplierName: row.supplier?.name ?? "",
                author_date_text: convertMillisecondsToDateWithTextMonths(+row.author_date),
                paid_date_text: row.paid_is_paid && row.paid_date
                    ? convertMillisecondsToDateWithTextMonths(+row.paid_date)
                    : "",
            }));
        }, [rows, selectedInvoicesWithVolume]);
        const columns = useMemo(
            () => [
                selectedColumn(onToggleChecked),
                volumeColumn(onChangeVolume),
                authorDateColumn(),
                paidColumn(),
                supplierNameColumn(),
                invoiceNumberColumn(),
                amountColumn(),
                invoiceFileLinkColumn(),
            ],
            [onToggleChecked, onChangeVolume]
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
                    position: "relative",
                }}
            >
                <MyDataGrid
                    tableName={"invoices_for_new_shipment"}
                    rows={adaptiveRows}
                    columns={columns}
                    loading={isLoading}
                />
            </Box>
        );
    }
;

export default memo(InvoicesTableForNewShipment);