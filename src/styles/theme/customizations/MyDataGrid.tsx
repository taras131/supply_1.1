import {DataGrid, DataGridProps, gridClasses} from "@mui/x-data-grid";
import React, {useEffect} from "react";
import {GridToolbar} from "@mui/x-data-grid/internals";

interface IProps extends DataGridProps {
    tableName: string;
    showToolbar?: boolean;
}

export const MyDataGrid = ({
                               tableName,
                               showToolbar = true,
                               slots: slotsProp,
                               slotProps: slotPropsProp,
                               columns,
                               ...rest
                           }: IProps) => {
    const STORAGE_KEY = `my-grid:${tableName}/columnVisibility`;
    const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<Record<string, boolean>>({});
    const handleVisibilityChange = React.useCallback((newModel: Record<string, boolean>) => {
        setColumnVisibilityModel(newModel);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newModel));
        } catch { /* ignore */
        }
    }, [STORAGE_KEY]);
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setColumnVisibilityModel(JSON.parse(saved));
            }
        } catch { /* ignore */
        }
    }, [tableName, STORAGE_KEY]);
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
            {...rest}
            columns={columns}
            rowHeight={70}
            columnHeaderHeight={90}
            density="compact"
            pagination
            showToolbar={showToolbar}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={handleVisibilityChange}
            pageSizeOptions={[25, 50, 100]}
            initialState={{pagination: {paginationModel: {pageSize: 50, page: 0}}}}
            slots={{
                toolbar: showToolbar ? GridToolbar : undefined,
                ...slotsProp,
            }}
            // Для Pro: покажем «быстрый фильтр» (поиск)
            slotProps={{
                toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: {debounceMs: 300},
                },
                ...slotPropsProp,
            }}
            sx={(theme) => ({
                fontFamily: '"Courier Prime", monospace',
                [`& .${gridClasses.row}:hover > .${gridClasses.cell}`]: {
                    backgroundColor: 'background.paper',
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(255,255,255,0.2)`,
                    zIndex: 2,
                },
                [`& .${gridClasses.columnHeader}`]: {backgroundColor: 'background.paper'},
                [`& .${gridClasses.footerContainer}`]: {backgroundColor: 'background.paper'},
                borderColor: 'divider',
                fontWeight: 500,
                color: 'text.secondary',
                backgroundColor: 'background.default',
                overflow: 'clip',
                [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {outline: 'transparent'},
                [`& .${gridClasses.columnHeader}:focus-within,
          & .${gridClasses.cell}:focus-within`]: {background: 'rgba(30,126,216,0.16)'},
                '& .editable-cell:focus-within': {background: 'rgba(30,126,216,0.16)'},
            })}
        />
    );
}
