import React, {FC, useCallback, useMemo} from "react";
import {formatDateDDMMYYYY} from "../../../utils/services";
import {getCategoryTitleById} from "../../machinery/utils/services";
import Box from "@mui/material/Box";
import {IMachineryProblem} from "../../../models/IMachineryProblems";
import StatusIcon from "../../machinery_tasks/ui/StatusIcon";
import PriorityChip from "../../machinery_tasks/ui/PriorityChip";
import {GridEventListener} from "@mui/x-data-grid";
import {useAppSelector} from "../../../hooks/redux";
import {selectMachineryProblemsIsLoading} from "../model/selectors";
import {useNavigate} from "react-router-dom";
import {routes} from "../../../utils/routes";
import {Typography} from "@mui/material";
import {MyDataGrid} from "../../../styles/theme/customizations/MyDataGrid";


interface IProps {
    rows: IMachineryProblem[] | null;
    isShowMachineryInfo: boolean;
    activeRowId?: number | null;
    onProblemClick: (problem: IMachineryProblem) => void;
}

const ProblemsTable: FC<IProps> = ({rows, isShowMachineryInfo, onProblemClick}) => {
        const navigate = useNavigate();
        const isLoading = useAppSelector(selectMachineryProblemsIsLoading)
        const adaptiveRows = rows?.map(row => ({
            ...row,
            machineryTitle: row.machinery ? `${row.machinery?.brand} ${row.machinery?.model}` : 'Текущая',
            machineryId: row.machinery?.id,
            category: getCategoryTitleById(row.category_id)
        }))
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
                    field: "solution",
                    headerName: "Рекомендации",
                    disableColumnMenu: true,
                    sortable: false,
                    renderCell: (params: any) => (params.row.solution ? "есть" : ""),
                    width: 70,
                },
                {
                    field: "priority_id",
                    headerName: "Приоритет",
                    disableColumnMenu: true,
                    renderCell: (params: any) => (<PriorityChip priorityId={params.row.priority_id}/>),
                    flex: 0.3,
                },
            ],
            [navigate, rows]);

        return (
            <MyDataGrid
                rows={adaptiveRows}
                columns={columns}
                loading={isLoading}
                onRowClick={handleRowClick}
                showToolbar
                tableName={"problems"}
            />
        );
    }
;

export default ProblemsTable;
