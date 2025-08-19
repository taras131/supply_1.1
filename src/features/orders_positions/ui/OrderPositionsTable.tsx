import * as React from 'react';
import {
    DataGrid,
    GridCellModes,
    GridCellModesModel, GridRowId,
    useGridApiRef,
} from '@mui/x-data-grid';
import {Button, IconButton,} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CustomToolbar from "./CustomToolbar";
import {INewOrderPosition} from "../../../models/IOrdersPositions";
import {GridToolbar} from "@mui/x-data-grid/internals";

type Id = string | number;

type OrderPositionsTableProps = {
    rows: INewOrderPosition[];
    onRowsChange: (newRows: INewOrderPosition[]) => void;
    handleAddRow: () => void;
    loading?: boolean;
};

const OrderPositionsTable: React.FC<OrderPositionsTableProps> = ({
                                                                     rows,
                                                                     onRowsChange,
                                                                     handleAddRow,
                                                                     loading
                                                                 }) => {
    const apiRef = useGridApiRef();
    const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});
    const [pendingEdit, setPendingEdit] = React.useState<{ id: string | number; field: string } | null>(null);
    const initialEditDoneRef = React.useRef(false);
    React.useEffect(() => {
        if (!initialEditDoneRef.current && rows.length) {
            initialEditDoneRef.current = true;
            setCellModesModel({
                [rows[0].id]: {name: {mode: GridCellModes.Edit}},
            });
            requestAnimationFrame(() => {
                const api = apiRef.current;
                if (!api) return; // грид ещё не смонтирован
                api.setCellFocus(rows[0].id, 'name');
            });
        }
    }, [rows, apiRef]);
    const awaitingFocusRef = React.useRef(false);
// 2) набор предыдущих id
    const prevIdsRef = React.useRef<Set<GridRowId>>(new Set());
// 3) враппер на добавление, ставим флаг
    const handleAddClick = React.useCallback(() => {
        awaitingFocusRef.current = true;
        handleAddRow();
    }, [handleAddRow]);
// 4) эффект: находим добавленный id и выставляем pendingEdit
    React.useEffect(() => {
        const prev = prevIdsRef.current;
        const curr = new Set<GridRowId>(rows.map(r => r.id as GridRowId));
        if (prev.size && awaitingFocusRef.current) {
            const added = rows.find(r => !prev.has(r.id as GridRowId));
            if (added) {
                setPendingEdit({ id: added.id, field: 'name' });
                awaitingFocusRef.current = false;
            }
        }
        prevIdsRef.current = curr;
    }, [rows]);
// 5) уже существующий эффект фокусировки — чуть усилим защиту
    React.useEffect(() => {
        if (!pendingEdit) return;
        const { id, field } = pendingEdit;
        const rowIndex = rows.findIndex(r => r.id === id);
        if (rowIndex === -1) return;
        // даём гриду дорендериться
        requestAnimationFrame(() => {
            const api = apiRef.current;
            if (!api) return;
            // если метода нет в вашей сборке — просто пропустим
            (api as any).scrollToIndexes?.({ rowIndex });
            // порядок: сначала открыть редактор, затем сфокусировать
            api.startCellEditMode({ id, field });
            api.setCellFocus(id, field);
        });
        setPendingEdit(null);
    }, [rows, pendingEdit, apiRef]);
    const columns = React.useMemo<any>(() => [
        {
            field: 'name',
            headerName: 'Наименование',
            flex: 1,
            editable: true,
            disableColumnMenu: true,
            cellClassName: 'editable-cell',
        },
        {
            field: 'catalog_number',
            headerName: 'Каталожный номер',
            flex: 1,
            editable: true,
            disableColumnMenu: true,
            cellClassName: 'editable-cell',
        },
        {
            field: 'count',
            headerName: 'Количество',
            width: 140,
            type: 'number',
            editable: true,
            disableColumnMenu: true,
            renderCell: (params: any) => params.row.count,
            cellClassName: 'editable-cell',
        },
        {
            field: 'delete',
            headerName: '',
            width: 60,
            sortable: false,
            filterable: false,
            align: 'center',
            disableColumnMenu: true,
            renderCell: (params: any) => (
                <IconButton
                    size="small"
                    onClick={() => onRowsChange(rows.filter(r => r.id !== params.id))}
                    aria-label="Удалить"
                >
                    <DeleteOutlineIcon fontSize="small"/>
                </IconButton>
            ),
            cellClassName: 'editable-cell',
        },
    ], [rows, onRowsChange]);
    const processRowUpdate = React.useCallback((newRow: INewOrderPosition, oldRow: INewOrderPosition) => {
        if (!newRow.name?.trim()) throw new Error('Наименование обязательно');
        if ((newRow.count ?? 0) <= 0) throw new Error('Количество должно быть > 0');

        const updated = rows.map(r =>
            r.id === oldRow.id
                ? {...oldRow, ...newRow, count: Number(newRow.count) || 0}
                : r
        );
        onRowsChange(updated);
        return newRow;
    }, [rows, onRowsChange]);

    return (
        <div style={{position: "relative"}}>

            <DataGrid
                apiRef={apiRef}
                rows={rows}

                getRowId={(row) => row.id}
                columns={columns}
                loading={loading}
                editMode="cell"
                cellModesModel={cellModesModel}
                onCellModesModelChange={setCellModesModel}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={(err) => console.error(err)}
                checkboxSelection
                disableRowSelectionOnClick
                pageSizeOptions={[10, 20, 50]}
                slots={{toolbar: GridToolbar}}
                slotProps={{
                    toolbar: {showQuickFilter: true, quickFilterProps: {debounceMs: 500}},
                    baseIconButton: {size: 'small'},
                }}
                sx={{
                    '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {outline: 'transparent'},
                    '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {outline: 'none'},
                    '& .editable-cell': {transition: 'background 0.2s, color 0.2s'},
                    '& .editable-cell:hover': {background: 'rgba(56, 144, 226, 0.08)', cursor: 'pointer'},
                    '& .editable-cell:focus-within': {background: 'rgba(30,126,216,0.16)'},
                }}
            />
            <Button sx={{position: "absolute", left: "10px", bottom: "10px"}} onClick={handleAddClick}>
                Добавить строку
            </Button>
        </div>
    );
};

export default OrderPositionsTable;