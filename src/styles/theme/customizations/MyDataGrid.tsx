import {DataGrid, DataGridProps, gridClasses} from "@mui/x-data-grid";
import {GridToolbar} from "@mui/x-data-grid/internals";
import {tablePaginationClasses} from "@mui/material";
import React, {useEffect} from "react";

interface IProps extends DataGridProps {
    tableName: string;
}

export const MyDataGrid = ({tableName,...props}: IProps) => {
    const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<Record<string, boolean>>({});
    const handleVisibilityChange = React.useCallback((newModel: Record<string, boolean>) => {
        setColumnVisibilityModel(newModel);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newModel));
        } catch { /* ignore */
        }
    }, []);
    const STORAGE_KEY = 'my-grid:columnVisibility';
    useEffect(() => {
        try {
            const saved = localStorage.getItem(`my-grid:${tableName}/columnVisibility`);
            if (saved) {
                setColumnVisibilityModel(JSON.parse(saved));
            }
        } catch { /* ignore */
        }
    }, [tableName]);
    useEffect(() => {
        setColumnVisibilityModel(prev => {
            const next = {...prev};
            for (const col of props.columns) {
                if (next[col.field] === undefined) next[col.field] = true;
            }
            return next;
        });
    }, [props.columns]);
    return (
        <DataGrid
            {...props}
            rowHeight={70}
            columnHeaderHeight={90}
            density="compact"
            pagination
            pageSizeOptions={[50, 25]}
            slots={{toolbar: GridToolbar}}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={handleVisibilityChange}
            slotProps={{
                toolbar: {showQuickFilter: true, quickFilterProps: {debounceMs: 500}},
                baseIconButton: {size: 'small'},
            }}
            showToolbar
            sx={(theme) => ({
                [`& .${gridClasses.row}:hover > .${gridClasses.cell}`]: {
                    backgroundColor: 'background.paper',
                    boxShadow: `
                        inset 0 1px 0 rgba(255,255,255,0.2), 
                        inset 0 -1px 0 rgba(255,255,255,0.2)  
                        `,
                    zIndex: 2,
                },
                [`& .${gridClasses.columnHeader}`]: {
                    backgroundColor: 'background.paper',
                },
                [`& .${gridClasses.footerContainer}`]: {
                    backgroundColor: 'background.paper',
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
                fontWeight: 500,
                color: 'text.secondary',
                backgroundColor: 'background.default',
                overflow: 'clip',
                [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {outline: 'transparent'},
                [`& .${gridClasses.columnHeader}:focus-within,
                 & .${gridClasses.cell}:focus-within`]: {background: 'rgba(30,126,216,0.16)'},
                '& .editable-cell:focus-within': {background: 'rgba(30,126,216,0.16)'}
            })}
        />
    );
}
/*

:root {
    /!* База UI/редактора *!/
    --ws-bg: #2B2B2B;              /!* фон редактора *!/
    --ws-fg: #A9B7C6;              /!* основной текст *!/
    --ws-gutter-bg: #313335;       /!* фон гаттера *!/
    --ws-gutter-fg: #606366;       /!* номера строк *!/
    --ws-caret-row-bg: #323232;    /!* строка каретки *!/
    --ws-selection-bg: #214283;    /!* фон выделения *!/
    --ws-selection-fg: #FFFFFF;    /!* текст при выделении *!/
    /!* Токены синтаксиса *!/
    --ws-comment: #808080;         /!* // комментарии *!/
    --ws-doc-comment: #629755;     /!* /!** javadoc *!/
    --ws-keyword: #CC7832;         /!* if, for, return *!/
    --ws-string: #6A8759;          /!* "строки" *!/
    --ws-number: #6897BB;          /!* 123, 0xFF *!/
    --ws-constant: #9876AA;        /!* CONSTANT, enum, символы *!/
    --ws-function: #FFC66D;        /!* имена функций/методов *!/
    --ws-class: #A9B7C6;           /!* имена классов/типов *!/
    --ws-interface: #A9B7C6;       /!* интерфейсы/типы *!/
    --ws-annotation: #BBB529;      /!* @Annotation *!/
    --ws-tag: #E8BF6A;             /!* HTML/XML теги *!/
    --ws-attr-name: #BABABA;       /!* имя атрибута *!/
    --ws-attr-value: #A5C261;      /!* значение атрибута *!/
    --ws-operator: #A9B7C6;        /!* + - * / = *!/
    --ws-punctuation: #A9B7C6;     /!* , ; . () {} [] *!/
}*/
