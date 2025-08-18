import React, {FC, useMemo} from 'react';
import {DataGrid, gridClasses} from "@mui/x-data-grid";
import {INewOrderPosition} from "../../../models/IOrdersPositions";
import {IconButton, Button, Stack} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from "@mui/material/Box";
import {GridToolbar} from "@mui/x-data-grid/internals";

type OrderPositionsTableProps = {
    rows: INewOrderPosition[];
    onChange: (rows: INewOrderPosition[]) => void;
    loading?: boolean;
};

function PositionsToolbar({onAdd, onDelete, canDelete}: {
    onAdd: () => void;
    onDelete: () => void;
    canDelete: boolean;
}) {
    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{p: 1}}
            className={gridClasses.toolbarContainer}  // сохраняет “родные” отступы/границы
        >
            <Button onClick={onAdd}>Добавить позицию</Button>
            <Button onClick={onDelete} disabled={!canDelete}>Удалить выбранные</Button>
            <Box sx={{flex: 1}}/>
        </Stack>
    );
}

const OrderPositionsTable: React.FC<OrderPositionsTableProps> = ({rows, onChange, loading}) => {
    const [selection, setSelection] = React.useState<Array<string | number>>([]);

    const columns = React.useMemo<any>(() => [
        {field: 'name', headerName: 'Наименование', flex: 1, editable: true},
        {field: 'catalog_number', headerName: 'Каталожный номер', flex: 1, editable: true},
        {
            field: 'count',
            headerName: 'Количество',
            width: 140,
            type: 'number',
            editable: true,
            renderCell: (value: any) => Number(value) || 0,
        },
        {
            field: 'delete',
            headerName: '',
            width: 60,
            sortable: false,
            filterable: false,
            align: 'center',
            renderCell: (params: any) => (
                <IconButton
                    size="small"
                    onClick={() => onChange(rows.filter(r => r.id !== params.id))}
                    aria-label="Удалить"
                >
                    <DeleteOutlineIcon fontSize="small"/>
                </IconButton>
            ),
        },
    ], [rows, onChange]);

    const handleAdd = () => {
        onChange([
            {id: rows[rows.length - 1].id + 1,
                name: '',
                catalog_number: '',
                count: 1} as INewOrderPosition,
            ...rows,
        ]);
    };

    const handleDeleteSelected = React.useCallback(() => {
        if (!selection.length) return;
        onChange(rows.filter(r => !selection.includes(r.id)));
        setSelection([]);
    }, [selection, rows, onChange]);

    // Работает в DataGrid (MIT) при редактировании ячеек (v6+)
    const processRowUpdate = React.useCallback((newRow: INewOrderPosition, oldRow: INewOrderPosition) => {
        if (!newRow.name?.trim()) throw new Error('Наименование обязательно');
        if ((newRow.count ?? 0) <= 0) throw new Error('Количество должно быть > 0');

        const updated = rows.map(r => r.id === oldRow.id
            ? {...oldRow, ...newRow, count: Number(newRow.count) || 0}
            : r,
        );
        onChange(updated);
        return newRow;
    }, [rows, onChange]);

    return (
        <DataGrid
            rows={rows}
            getRowId={(row) => row.id}
            columns={columns}
            loading={loading}
            editMode="cell"
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(err) => console.error(err)}
            checkboxSelection
            disableRowSelectionOnClick
            density="compact"
            pageSizeOptions={[10, 20, 50]}
            slots={{toolbar: GridToolbar}}
            slotProps={{
                toolbar: {showQuickFilter: true, quickFilterProps: {debounceMs: 500}},
                baseIconButton: {size: 'small'},
            }}
            sx={{
                '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {outline: 'transparent'},
                '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {outline: 'none'},
            }}
        />
    );
};

export default OrderPositionsTable;