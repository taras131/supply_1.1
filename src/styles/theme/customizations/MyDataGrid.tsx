import {DataGrid, DataGridProps, gridClasses} from "@mui/x-data-grid";
import {GridToolbar} from "@mui/x-data-grid/internals";
import {tablePaginationClasses} from "@mui/material";

export const MyDataGrid = (props: DataGridProps) => {
    return (
        <DataGrid
            {...props}
            rowHeight={70}
            columnHeaderHeight={90}
            density="compact"
            pagination
            pageSizeOptions={[50, 25]}
            slots={{toolbar: GridToolbar}}
            slotProps={{
                toolbar: {showQuickFilter: true, quickFilterProps: {debounceMs: 500}},
                baseIconButton: {size: 'small'},
            }}
            showToolbar
            sx={(theme) => ({
                [`& .${gridClasses.columnHeader}`]: {
                    backgroundColor: 'background.paper',
                },
                [`& .${gridClasses.footerContainer}`]: {
                    backgroundColor:'background.paper',
                },
                [`& .${tablePaginationClasses.root}`]: {
                    marginRight: theme.spacing(1),
                    '& .MuiIconButton-root': {
                        maxHeight: 45,
                        maxWidth: 45,
                        '& > svg': {
                            fontSize: '1.5rem',
                        },
                    },
                },
                borderColor: 'divider',
                backgroundColor: 'background.default',
                overflow: 'clip',
                [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {outline: 'transparent'},
                [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {outline: 'none'},
            })}
        />
    );
}