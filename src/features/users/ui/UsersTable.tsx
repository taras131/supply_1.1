import React, {FC} from "react";
import {IUser, userRoles} from "../../../models/IUser";
import {DataGrid} from "@mui/x-data-grid";

interface IProps {
    rows: IUser[];
}

const UsersTable: FC<IProps> = ({rows}) => {
    const columns: any[] = [
        {
            field: 'first_name',
            headerName: 'Имя',
            flex: 1,
            disableColumnMenu: true,
        },
        {
            field: 'middle_name',
            headerName: 'Отчество',
            flex: 1,
            disableColumnMenu: true,
        },
        {
            field: 'email',
            headerName: 'Почта',
            editable: true,
            flex: 1,
            disableColumnMenu: true,
            sortable: false,
        },
        {
            field: 'role_id',
            headerName: 'Должность',
            description: 'This column has a value getter and is not sortable.',
            width: 160,
            renderCell: (params: any) => userRoles[params.value].title,
            flex: 1,
            disableColumnMenu: true,
        },
    ];
    return (
        <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 5,
                    },
                },
            }}
            pageSizeOptions={[10]}
            showToolbar
        />
    );
};

export default UsersTable;
