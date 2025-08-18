import React, {FC} from "react";
import {IUser, userRoles} from "../../../models/IUser";
import {DataGrid} from "@mui/x-data-grid";

interface IProps {
    rows: IUser[];
}

const UserList: FC<IProps> = ({rows}) => {
    const columns: any[] = [
        {field: 'id', headerName: 'ID', width: 90},
        {
            field: 'first_name',
            headerName: 'Имя',
            flexGrow: 1,
        },
        {
            field: 'middle_name',
            headerName: 'Отчество',
            flexGrow: 1,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'role_id',
            headerName: 'Должность',
            description: 'This column has a value getter and is not sortable.',
            width: 160,
            renderCell: (params: any) => userRoles[params.value].title,
        },
    ];
    return (
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 5,
                    },
                },
            }}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
        />
    );
};

export default UserList;
