import React, {FC, useCallback, useEffect, useMemo, useState} from "react";
import {formatDateDDMMYYYY} from "../../../utils/services";
import {getCategoryTitleById} from "../../machinery/utils/services";
import Box from "@mui/material/Box";
import {IMachineryProblem} from "../../../models/IMachineryProblems";
import StatusIcon from "../../machinery_tasks/ui/StatusIcon";
import PriorityChip from "../../machinery_tasks/ui/PriorityChip";
import {DataGrid, gridClasses, GridEventListener} from "@mui/x-data-grid";
import {GridToolbar} from "@mui/x-data-grid/internals";
import {useAppSelector} from "../../../hooks/redux";
import {selectMachineryProblemsIsLoading} from "../model/selectors";
import {Link, useNavigate} from "react-router-dom";
import {routes} from "../../../utils/routes";
import {Typography} from "@mui/material";

const STORAGE_KEY = 'my-grid:problemColumnVisibility';

interface IProps {
    rows: IMachineryProblem[] | null;
    onProblemClick: (problem: IMachineryProblem) => void;
    isShowMachineryInfo: boolean;
    activeRowId?: number | null;
}

const ProblemsTable: FC<IProps> = ({rows, onProblemClick, isShowMachineryInfo, activeRowId = null}) => {
        const navigate = useNavigate();
        const isLoading = useAppSelector(selectMachineryProblemsIsLoading)
        const [sortModel, setSortModel] = React.useState<any>([]);
        const [columnVisibilityModel, setColumnVisibilityModel] = useState<Record<string, boolean>>({});
        const adaptiveRows = rows?.map(row => ({
            ...row,
            machineryTitle: row.machinery ? `${row.machinery?.brand} ${row.machinery?.model}` : 'Текущая',
            machineryId: row.machinery?.id,
            category: getCategoryTitleById(row.category_id)
        }))
        const handleVisibilityChange = useCallback((newModel: Record<string, boolean>) => {
            setColumnVisibilityModel(newModel);
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newModel));
            } catch { /* ignore */
            }
        }, []);
        const handleRowClick = useCallback<GridEventListener<"rowClick">>(
            ({row}) => {
                onProblemClick(row);
            },
            [onProblemClick],
        );
        let columns = useMemo<any>(() => [
                {
                    field: "status_id",
                    headerName: "Статус",
                    disableColumnMenu: true,
                    renderCell: (params: any) => (
                        <Box display="flex"
                             alignItems="center"
                             justifyContent="center"
                             sx={{
                                 width: '100%',
                                 height: '100%',
                             }}>
                            <StatusIcon statusId={params.row.status_id}/>
                        </Box>
                    ),
                },
                {
                    field: "created_at",
                    headerName: "Дата",
                    disableColumnMenu: true,
                    renderCell: (params: any) => (formatDateDDMMYYYY(params.row.created_at)),
                    flex: 0.3,
                },
                {
                    field: "machineryTitle",
                    headerName: "Техника",
                    disableColumnMenu: true,
                    flex: 0.4,
                    renderCell: (params: any) => {
                        const id = params.row?.machineryId;
                        const label = params.value ?? params.row?.machineryTitle ?? "";
                        const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
                            e.stopPropagation();
                            (e as any).defaultMuiPrevented = true;
                            navigate(routes.machineryDetails.replace(":machineryId", id));
                        };
                        const stop = (e: React.SyntheticEvent) => {
                            e.stopPropagation();
                            // @ts-ignore
                            (e as any).defaultMuiPrevented = true;
                        };
                        return (
                            <Box
                                onMouseDown={stop}
                                onDoubleClick={stop}
                                onClick={handleClick}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <Typography color={"primary"} noWrap>
                                    {label}
                                </Typography>
                            </Box>
                        );
                    }
                },

                {
                    field: "operating",
                    headerName: "Наработка",
                    disableColumnMenu: true,
                    flex: 0.2,
                    type: 'number',
                },
                {
                    field: "odometer",
                    headerName: "Пробег",
                    disableColumnMenu: true,
                    flex: 0.2,
                    type: 'number',
                },
                {
                    field: "category",
                    headerName: "Категория",
                    disableColumnMenu: true,
                    flex: 0.3,
                },
                {
                    field: "title",
                    headerName: "Заголовок",
                    disableColumnMenu: true,
                    sortable: false,
                    flex: 0.6,
                },
                {
                    field: "description",
                    headerName: "Описание",
                    disableColumnMenu: true,
                    sortable: false,
                    flex: 1,
                },
                {
                    field: "priority_id",
                    headerName: "Приоритет",
                    disableColumnMenu: true,
                    renderCell: (params: any) => (<PriorityChip priorityId={params.row.priority_id}/>),
                    flex: 0.3,
                },
            ],
            [navigate]);
        useEffect(() => {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    setColumnVisibilityModel(JSON.parse(saved));
                }
            } catch { /* ignore */
            }
        }, []);
        useEffect(() => {
            setColumnVisibilityModel(prev => {
                const next = {...prev};
                for (const col of columns) {
                    if (next[col.field] === undefined) next[col.field] = true;
                }
                return next;
            });
        }, [columns]);
        if (!rows) return null;
        return (
            <DataGrid
                rows={adaptiveRows}
                columns={columns}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={handleVisibilityChange}
                sortModel={sortModel}
                onSortModelChange={setSortModel}
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
    }
;

export default ProblemsTable;
