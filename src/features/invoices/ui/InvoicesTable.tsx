import React, {FC, memo, useCallback, useMemo} from 'react';
import Box from "@mui/material/Box";
import {MyDataGrid} from "../../../styles/theme/customizations/MyDataGrid";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectInvoices, selectInvoicesIsLoading} from "../model/selectors";
import {GridEventListener} from "@mui/x-data-grid";
import {routes} from "../../../utils/routes";
import {useNavigate} from "react-router-dom";
import {
    convertMillisecondsToDateWithTextMonths,
} from "../../../utils/services";
import { Stack, Typography} from "@mui/material";

import {IInvoice} from "../../../models/iInvoices";
import {selectCurrentUserId} from "../../users/model/selectors";
import {fetchUpdateInvoice, TInvoiceFilter} from "../model/actions";
import EditableSelect from "../../../components/common/EditableSelect";
import {
    amountColumn, approvedColumn,
    authorDateColumn, invoiceFileLinkColumn, invoiceNumberColumn,
    paidColumn, paymentFileLinkColumn,
    supplierNameColumn,
    withWatColumn
} from "../../shipments/ui/Сolumns";

const filterOptions: TInvoiceFilter[] = ["all", "only_no_paid", "only_cancel"]
const filterOptionLabels = {all: "Все", only_no_paid: "Не оплаченные", only_cancel: "Отменённые"}

interface IProps {
    filterValue?: TInvoiceFilter
    filterChangeHandler?: (e: TInvoiceFilter) => void;
}

const InvoicesTable: FC<IProps> = ({
                                       filterValue,
                                       filterChangeHandler,
                                   }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const rows = useAppSelector(selectInvoices)
    const isLoading = useAppSelector(selectInvoicesIsLoading)
    const currentUserId = useAppSelector(selectCurrentUserId)
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
    const columns = useMemo(
        () => [
            approvedColumn(onToggleApproved),
            authorDateColumn(),
            paidColumn(),
            supplierNameColumn(),
            invoiceNumberColumn(),
            amountColumn(),
            withWatColumn(),
            invoiceFileLinkColumn(),
            paymentFileLinkColumn(),
        ],
        [onToggleApproved]
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