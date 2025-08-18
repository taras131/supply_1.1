import React, {FC, useEffect, useMemo} from "react";
import {IMachinery} from "../../../models/iMachinery";
import RelatedTasksItem from "../../machinery_tasks/ui/RelatedTasksItem";
import {routes} from "../../../utils/routes";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {fetchUpdateMachinery} from "../model/actions";
import {machineryTypes} from "../utils/const";
import {DataGrid, gridClasses} from "@mui/x-data-grid";
import {GridToolbar} from "@mui/x-data-grid/internals";
import {selectMachineryIsLoading} from "../model/selectors";

const STORAGE_KEY = 'my-grid:maintenanceColumnVisibility';


interface IProps {
    rows: IMachinery[] | null;
}

const MachineryMaintenanceTable: FC<IProps> = ({rows}) => {
        const navigate = useNavigate();
        const dispatch = useAppDispatch();
        const isLoading = useAppSelector(selectMachineryIsLoading)
        const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<Record<string, boolean>>({});
        const handleVisibilityChange = React.useCallback((newModel: Record<string, boolean>) => {
            setColumnVisibilityModel(newModel);
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newModel));
            } catch { /* ignore */
            }
        }, []);
        const columns = useMemo<any>(() => [
            {
                field: "type_id",
                headerName: "Категория",
                renderCell: (params: any) => {
                    const value = params.value ?? params.row.type_id;
                    return machineryTypes.find((t) => t.id === value)?.title || "";
                },
                flex: 0.5,
            },
            {field: "brand", headerName: "Марка", disableColumnMenu: true, flex: 0.5},
            {
                field: "model",
                headerName: "Модель",
                disableColumnMenu: true,
                renderCell: (params: any) => {
                    return (<Link to={routes.machineryDetails.replace(":machineryId", params.row.id)}>
                        {params.row.model}
                    </Link>);
                },
                flex: 0.5
            },
            {
                field: "state_number",
                headerName: "Гос. номер",
                disableColumnMenu: true,
                sortable: false,
                flex: 0.5
            },
            {
                field: "operating",
                headerName: "Наработка",
                disableColumnMenu: true,
                flex: 0.5,
                editable: true,
                type: 'number',
                cellClassName: "editable-cell",
            },
            {
                field: "odometer",
                headerName: "Пробег",
                disableColumnMenu: true,
                flex: 0.5,
                editable: true,
                type: 'number',
                cellClassName: "editable-cell",
            },
            {
                field: "last_completed_service_task",
                headerName: "Последнее завершённое ТО",
                disableColumnMenu: true,
                flex: 1,
                renderCell: (params: any) => {
                    const taskClickHandler = () => {
                        navigate(routes.machineryTaskDetails.replace(":taskId", params.row.last_completed_service_task?.id || ""));
                    };
                    return (
                        <>
                            {params.row.last_completed_service_task ? (
                                <RelatedTasksItem
                                    task={params.row.last_completed_service_task}
                                    taskClickHandler={taskClickHandler}
                                    isMaintenanceMode={true}
                                />
                            ) : (
                                "Нет завершённых ТО"
                            )}
                        </>
                    );
                },
            },
            {
                field: "next_service_task",
                headerName: "Предстоящее ТО",
                disableColumnMenu: true,
                flex: 1,
                renderCell: (params: any) => {
                    const taskClickHandler = (e: any) => {
                        e.stopPropagation();
                        navigate(routes.machineryTaskDetails.replace(":taskId", params.row.next_service_task?.id || ""));
                    };
                    const plannedClickHandler = (e: any) => {
                        e.stopPropagation();
                        navigate(routes.machineryAddTask.replace(":machineryId", params.row.id), {
                            state: {taskTypeId: 1},
                        });
                    };
                    return (
                        <>
                            {params.row.next_service_task ? (
                                <RelatedTasksItem
                                    task={params.row.next_service_task}
                                    taskClickHandler={taskClickHandler}
                                    isMaintenanceMode={true}
                                />
                            ) : (
                                <Button onClick={plannedClickHandler}>Запланировать</Button>
                            )}
                        </>
                    );
                },
            },

        ], [navigate]);
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
                rows={rows}
                columns={columns}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={handleVisibilityChange}
                processRowUpdate={async (updatedRow, oldRow) => {
                    if (updatedRow !== oldRow) {
                        await dispatch(fetchUpdateMachinery(updatedRow));
                    }
                    return updatedRow;
                }}
                pagination
                pageSizeOptions={[10, 20, 50]}
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
                    '& .editable-cell': {
                        transition: 'background 0.2s, color 0.2s',
                    },
                    '& .editable-cell:hover': {
                        background: 'rgba(56, 144, 226, 0.08)',
                        cursor: 'pointer',
                    },
                    '& .editable-cell:focus-within': {
                        background: 'rgba(56, 144, 226, 0.16)',
                    },
                }}
                showToolbar
            />)
    }
;

export default MachineryMaintenanceTable;
