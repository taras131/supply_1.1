import React, {useMemo} from 'react';
import {useAppSelector} from "../../../hooks/redux";
import {selectAllOrdersPositions} from "../model/selectors";
import {MyDataGrid} from "../../../styles/theme/customizations/MyDataGrid";
import {selectInvoicesIsLoading} from "../../invoices/model/selectors";
import {catalogNumberColumn, countColumn, nameColumn, rowNumberColumn, unitMeasureColumn} from "./Columns";

const OrderPositionsTableForInvoice = () => {
    const rows = useAppSelector(selectAllOrdersPositions)
    const loading = useAppSelector(selectInvoicesIsLoading)
    const columns = useMemo(
        () => [
            rowNumberColumn(),
            nameColumn(),
            catalogNumberColumn(),
            countColumn(),
            unitMeasureColumn()
        ],
        []
    );
    return (
        <MyDataGrid
            tableName={"order_positions_for_invoice"}
            rows={rows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
        />
    );
};

export default OrderPositionsTableForInvoice;