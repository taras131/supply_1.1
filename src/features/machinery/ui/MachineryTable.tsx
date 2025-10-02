import React, {FC, useCallback, useMemo} from 'react';
import {IMachinery} from "../../../models/iMachinery";
import {
    GridEventListener,
} from "@mui/x-data-grid";
import {useAppSelector} from "../../../hooks/redux";
import {selectMachineryIsLoading} from "../model/selectors";
import {routes} from "../../../utils/routes";
import {useNavigate} from "react-router-dom";
import {machineryTypes} from "../utils/const";
import {MachineryStatus} from "../../../utils/const";
import Chip from "@mui/material/Chip";
import {fileServerPath, nestServerPath} from "../../../api";
import photoPlaceholder from "../../../assets/images/placeholder.png";
import {styled} from "@mui/material/styles";
import {MyDataGrid} from "../../../styles/theme/customizations/MyDataGrid";
import Box from "@mui/material/Box";

const StyledImage = styled("img")({
    width: "100%",
    height: "60px",
    objectFit: "contain",
    backgroundColor: 'background.default',
    borderRadius: "3px",
});

function renderStatus(status: MachineryStatus) {
    const colors: { [index: string]: 'success' | 'warning' | 'error' } = {
        [MachineryStatus.active]: 'success',
        [MachineryStatus.repair]: 'warning',
        [MachineryStatus.disActive]: 'error',
    };
    return (<Chip sx={{width: "120px"}}
                  label={status}
                  color={colors[status]}
                  size="small"/>);
}


interface IProps {
    rows: IMachinery [];
}

const MachineryTable: FC<IProps> = ({rows}) => {
    const navigate = useNavigate();
    const isLoading = useAppSelector(selectMachineryIsLoading)
    const [sortModel, setSortModel] = React.useState<any>([]);
    const [filterModel, setFilterModel] = React.useState<any>({items: [], quickFilterValues: []});
    const handleRowClick = useCallback<GridEventListener<"rowClick">>(
        ({row}) => {
            navigate(`${routes.machineryDetails.replace(":machineryId", row.id)}`);
        },
        [navigate],
    );
    const handleRowEdit = useCallback(
        (machinery: IMachinery) => () => {
            navigate(`${routes.machineryDetails.replace(":machineryId", machinery.id)}`);
        },
        [navigate],
    );
    const columns = useMemo<any>(() => [
        {
            field: "photos",
            headerName: "Фото",
            disableColumnMenu: true,
            sortable: false,
            renderCell: (params: any) => {
                const photoPath = params.row.photos[0]
                    ? `${fileServerPath}/${params.row.photos[0]}`
                    : photoPlaceholder;
                return <StyledImage src={photoPath} alt="machinery_photo" />;
            },
            flex: 0.5,
        },
        {
            field: "type_id",
            headerName: "Категория",
            disableColumnMenu: true,
            renderCell: (params: any) => {
                const value = params.value ?? params.row.type_id;
                return machineryTypes.find((t) => t.id === value)?.title || "";
            },
            flex: 0.5,
        },
        {field: "brand", headerName: "Марка", disableColumnMenu: true, flex: 0.5},
        {field: "model", headerName: "Модель", disableColumnMenu: true, flex: 0.5},
        {
            field: "year_manufacture",
            headerName:
                "Год выпуска",
            type: 'number',
            disableColumnMenu: true,
        },
        {
            field: "state_number",
            headerName: "Гос. номер",
            disableColumnMenu: true,
            sortable: false,
            flex: 0.5
        },
        {
            field: "vin",
            headerName: "VIN",
            disableColumnMenu: true,
            sortable: false,
            flex: 1
        },
        {
            field: 'status',
            headerName: 'Статус',
            type: 'singleSelect',

            width: 200,
            valueOptions: [MachineryStatus.active, MachineryStatus.repair, MachineryStatus.disActive],
            renderCell: (params: any) => renderStatus(params.value),
            sortComparator: (a: any, b: any) => {
                const order = {
                    [MachineryStatus.active]: 0,
                    [MachineryStatus.repair]: 1,
                    [MachineryStatus.disActive]: 2,
                } as const;
                return (order[a as keyof typeof order] ?? 99) - (order[b as keyof typeof order] ?? 99);
            },
            disableColumnMenu: true,
        },
     /*   {
            field: "actions",
            type: "actions",
            headerName: '',
            width: 56,
            align: "right",
            getActions: (params: any) => [
                <GridActionsCellItem
                    key="edit-item"
                    icon={<EditIcon fontSize="small"/>}
                    label="Edit"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRowEdit(params.row as IMachinery);
                    }}
                />
            ],
            disableColumnMenu: true,
        },*/
    ], [handleRowEdit]);

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
            tableName={"machinery"}
            rows={rows}
            columns={columns}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
            disableRowSelectionOnClick
            rowHeight={90}
            columnHeaderHeight={70}
            loading={isLoading}
            onRowClick={handleRowClick}
        />
        </Box>
    );
};

export default MachineryTable;