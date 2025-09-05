import React, {FC, memo, useCallback, useMemo} from "react";
import {useAppSelector} from "../../../hooks/redux";
import {selectInvoices, selectInvoicesIsLoading} from "../model/selectors";
import {convertMillisecondsToDateWithTextMonths} from "../../../utils/services";
import {
    amountColumn,
    invoiceFileLinkColumn,
    invoiceNumberColumn,
    paidColumn, showVolumeColumn,
    supplierNameColumn,
} from "../../shipments/ui/Сolumns";
import Box from "@mui/material/Box";
import {MyDataGrid} from "../../../styles/theme/customizations/MyDataGrid";
import {GridEventListener} from "@mui/x-data-grid";
import {routes} from "../../../utils/routes";
import {useNavigate} from "react-router-dom";

const InvoicesTableForShipment: FC = () => {
        const rows = useAppSelector(selectInvoices)
        const navigate = useNavigate();
        const isLoading = useAppSelector(selectInvoicesIsLoading)
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
        const adaptiveRows = useMemo(() => {
            if (!rows) return [];
            return rows.map((row) => ({
                ...row,
                supplierName: row.supplier?.name ?? "",
                author_date_text: convertMillisecondsToDateWithTextMonths(+row.author_date),
                paid_date_text: row.paid_is_paid && row.paid_date
                    ? convertMillisecondsToDateWithTextMonths(+row.paid_date)
                    : "",
                volume: row.volume === "completely" ? "Полностью" : "Частично",
            }));
        }, [rows]);
        const columns = useMemo(
            () => [
                paidColumn(),
                supplierNameColumn(),
                invoiceNumberColumn(),
                amountColumn(),
                invoiceFileLinkColumn(),
                showVolumeColumn(),
            ],
            []
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
                    tableName={"invoices_for_shipment"}
                    rows={adaptiveRows}
                    columns={columns}
                    loading={isLoading}
                    onRowClick={handleRowClick}
                />
            </Box>
        );
    }
;

export default memo(InvoicesTableForShipment);