import React, {FC, useCallback, useMemo} from 'react';
import {ISupplier} from '../../../models/iSuppliers';
import {useAppSelector} from "../../../hooks/redux";
import {selectSuppliers, selectSuppliersIsLoading} from "../model/selectors";
import Box from "@mui/material/Box";
import {MyDataGrid} from "../../../styles/theme/customizations/MyDataGrid";
import {GridEventListener} from "@mui/x-data-grid";

interface IProps {
    supplierClickHandler: (supplier: ISupplier) => void;
}

const SuppliersTable: FC<IProps> = ({supplierClickHandler}) => {
    let rows = useAppSelector(selectSuppliers);
    const isLoading = useAppSelector(selectSuppliersIsLoading);
    const handleRowClick = useCallback<GridEventListener<"rowClick">>(
        ({row}) => {
            supplierClickHandler(row);
        },
        [supplierClickHandler],
    );
    const columns = useMemo<any>(
        () => [
            {
                field: "name",
                headerName: "Наименование",
                disableColumnMenu: true,
                flex: 1,
            },
            {
                field: "INN",
                headerName: "ИНН",
                disableColumnMenu: true,
                flex: 1,
            },
            {
                field: "city",
                headerName: "Город",
                disableColumnMenu: true,
            },
            {
                field: "manager_email",
                headerName: "Почта",
                disableColumnMenu: true,
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
                tableName={"supplier"}
                rows={rows}
                columns={columns}
                loading={isLoading}
                onRowClick={handleRowClick}
            />
        </Box>
    );
};

export default SuppliersTable;
