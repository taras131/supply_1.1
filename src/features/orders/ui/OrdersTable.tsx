import React, {FC, useCallback, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {
    DataGrid,
    gridClasses,
    GridEventListener,
} from "@mui/x-data-grid";
import {routes} from "../../../utils/routes";
import {IOrder} from "../../../models/iOrders";
import {GridToolbar} from "@mui/x-data-grid/internals";
import {useAppSelector} from "../../../hooks/redux";
import {selectOrdersIsLoading} from "../model/selectors";
import {formatDateDDMMYYYY} from "../../../utils/services";


interface IProps {
    rows: IOrder[];
}

const OrdersTable: FC<IProps> = ({rows}) => {
    const navigate = useNavigate();
    const isLoading = useAppSelector(selectOrdersIsLoading)
    const handleRowClick = useCallback<GridEventListener<"rowClick">>(
        ({row}) => {
            navigate(`${routes.ordersDetails.replace(":orderId", row.id)}`);
        },
        [navigate],
    );
    const columns = useMemo<any>(
        () => [
            {
                field: "created_at",
                headerName: "Дата",
                disableColumnMenu: true,
                renderCell: (params: any) => (formatDateDDMMYYYY(params.row.created_at)),
                flex: 0.3,
            },
            {field: "title", headerName: "Название"},

        ],
        [],
    );
    return (
        <DataGrid
            rows={rows}
            columns={columns}
            pagination
            pageSizeOptions={[10, 20, 50]}
            slots={{toolbar: GridToolbar}}
            slotProps={{
                toolbar: {showQuickFilter: true, quickFilterProps: {debounceMs: 500}},
                baseIconButton: {size: 'small'},
            }}
            density="compact"
            rowHeight={90}
            columnHeaderHeight={70}
            loading={isLoading}
            sx={{
                [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {outline: 'transparent'},
                [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {outline: 'none'},
                [`& .${gridClasses.row}:hover`]: {cursor: 'pointer'},
            }}
            onRowClick={handleRowClick}
            showToolbar
        />
    );
};

export default OrdersTable;
