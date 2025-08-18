import React, {FC, useCallback, useEffect} from 'react';
import {IMachinery} from "../../../models/iMachinery";
import {
    DataGrid,
    GridActionsCellItem,
    gridClasses,
    GridEventListener,
} from "@mui/x-data-grid";
import {useAppSelector} from "../../../hooks/redux";
import {selectMachineryIsLoading} from "../model/selectors";
import {routes} from "../../../utils/routes";
import {useNavigate} from "react-router-dom";
import {machineryTypes} from "../utils/const";
import {MachineryStatus} from "../../../utils/const";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import {GridToolbar} from "@mui/x-data-grid/internals";
import {nestServerPath} from "../../../api";
import photoPlaceholder from "../../../assets/images/placeholder.png";
import {styled} from "@mui/material/styles";

const STORAGE_KEY = 'my-grid:columnVisibility';

const StyledImage = styled("img")({
    width: "100%",
    height: "70px",
    objectFit: "contain",
    backgroundColor: "white",
    borderRadius: "8px",
});

function renderStatus(status: MachineryStatus) {
    const colors: { [index: string]: 'success' | 'warning' | 'error' } = {
        [MachineryStatus.active]: 'success',
        [MachineryStatus.repair]: 'warning',
        [MachineryStatus.disActive]: 'error',
    };
    return (<Chip sx={{width: "80px"}}
                  label={status}
                  color={colors[status]}
                  size="small"/>);
}


interface IProps {
    rows: IMachinery [];
}

const MachineryNewTable: FC<IProps> = ({rows}) => {
    const navigate = useNavigate();
    const isLoading = useAppSelector(selectMachineryIsLoading)
    const [paginationModel, setPaginationModel] = React.useState<any>({page: 0, pageSize: 20});
    const [sortModel, setSortModel] = React.useState<any>([]);
    const [filterModel, setFilterModel] = React.useState<any>({items: [], quickFilterValues: []});
    const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<Record<string, boolean>>({});
    const handleVisibilityChange = React.useCallback((newModel: Record<string, boolean>) => {
        setColumnVisibilityModel(newModel);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newModel));
        } catch { /* ignore */
        }
    }, []);
    const handleRowClick = useCallback<GridEventListener<"rowClick">>(
        ({row}) => {
            console.log(row)
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
    const columns = React.useMemo<any>(() => [
        {
            field: "photos",
            headerName: "Фото",
            renderCell: (params: any) => {
                console.log('params:', params);
                const photoPath = params.row.photos[0]
                    ? `${nestServerPath}/static/${params.row.photos[0]}`
                    : photoPlaceholder;
                return <StyledImage src={photoPath} alt="machinery_photo" />;
            },
            flex: 0.5,
        },
        {
            field: "type_id",
            headerName: "Категория",
            renderCell: (params: any) => {
                console.log('params:', params);
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
            flex: 0.6,
            minWidth: 120,
            valueOptions: [MachineryStatus.active, MachineryStatus.repair, MachineryStatus.disActive],
            renderCell: (params: any) => renderStatus(params.value),
            // Кастомная сортировка статусов по своему порядку (опционально)
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
        {
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
        },
    ], [handleRowEdit]);
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setColumnVisibilityModel(JSON.parse(saved));
            }
        } catch { /* ignore */
        }
    }, []);
    // Автодобавление новых колонок как видимых (если columns меняется)
    useEffect(() => {
        setColumnVisibilityModel(prev => {
            const next = {...prev};
            for (const col of columns) {
                if (next[col.field] === undefined) next[col.field] = true;
            }
            return next;
        });
    }, [columns]);
    return (
        <DataGrid
            rows={rows}
            columns={columns}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={handleVisibilityChange}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 50]}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
            slots={{toolbar: GridToolbar}}
            slotProps={{
                toolbar: {showQuickFilter: true, quickFilterProps: {debounceMs: 500}},
                baseIconButton: {size: 'small'},
            }}
            disableRowSelectionOnClick
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

export default MachineryNewTable;