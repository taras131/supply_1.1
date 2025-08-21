import React, {FC, useMemo} from "react";
import {IMachinery} from "../../../models/iMachinery";
import RelatedTasksItem from "../../machinery_tasks/ui/RelatedTasksItem";
import {routes} from "../../../utils/routes";
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {fetchUpdateMachinery} from "../model/actions";
import {machineryTypes} from "../utils/const";
import {selectMachineryIsLoading} from "../model/selectors";
import {MyDataGrid} from "../../../styles/theme/customizations/MyDataGrid";
import MyButton from "../../../styles/theme/customizations/MyButton";

interface IProps {
    rows: IMachinery[];
}

const MachineryMaintenanceTable: FC<IProps> = ({rows}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(selectMachineryIsLoading)
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
                            <MyButton onClick={plannedClickHandler}>Запланировать</MyButton>
                        )}
                    </>
                );
            },
        },

    ], [navigate]);
    return (
        <MyDataGrid
            tableName="maintenanceTable"
            rows={rows}
            columns={columns}
            processRowUpdate={async (updatedRow, oldRow) => {
                if (updatedRow !== oldRow) {
                    await dispatch(fetchUpdateMachinery(updatedRow));
                }
                return updatedRow;
            }}
            disableRowSelectionOnClick
            loading={isLoading}
        />)
};

export default MachineryMaintenanceTable;
