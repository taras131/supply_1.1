import React, {FC, useCallback, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {GridEventListener} from "@mui/x-data-grid";
import {routes} from "../../../utils/routes";
import {useAppSelector} from "../../../hooks/redux";
import {selectOrders, selectOrdersIsLoading} from "../model/selectors";
import {formatDateDDMMYYYY} from "../../../utils/services";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import DirectionsSubwayIcon from "@mui/icons-material/DirectionsSubway";
import CompletionBar from "./CompletionBar";
import IconWrapper from "../../../components/common/IconWrapper";
import {MyDataGrid} from "../../../styles/theme/customizations/MyDataGrid";
import Box from "@mui/material/Box";

const OrdersTable: FC = () => {
    const navigate = useNavigate();
    const rows = useAppSelector(selectOrders)
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
                flex: 0.1,
            },
            {
                field: "title",
                headerName: "Название",
                disableColumnMenu: true,
                flex: 1,
            },
            {
                field: 'completion_percent',
                headerName: 'Выполнение',
                flex: 0.4,
                type: 'number',
                sortable: true,
                disableColumnMenu: true,
                renderCell: (params: any) => (
                    <CompletionBar
                        percent={params.row.completion_percent}
                        done={params.row.positions_done}
                        total={params.row.positions_total}
                        itemsDone={params.row.items_done}
                        itemsTotal={params.row.items_total}
                    />
                ),
            },
            {
                field: "shipment_type",
                headerName: "",
                disableColumnMenu: true,
                renderCell: (params: any) => (
                    <IconWrapper tooltipTitle="Авиа доставка">
                        {params.row.shipments_type === "air"
                            ? <AirplanemodeActiveIcon/>
                            : <DirectionsSubwayIcon/>}
                    </IconWrapper>
                ),
            },
        ],
        [],
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
                "& .MuiDataGrid-cell:focus-visible, & .MuiDataGrid-columnHeader:focus-visible": (theme) => ({
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: -1,
                }),
            }}
        >
            <MyDataGrid
                tableName={"orders"}
                rows={rows}
                columns={columns}
                loading={isLoading}
                onRowClick={handleRowClick}
            />
        </Box>
    );
};

export default OrdersTable;
