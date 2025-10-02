import React from "react";
import {useAppSelector} from "../../../hooks/redux";
import {Stack, Typography} from "@mui/material";
import UsersTable from "./UsersTable";
import {selectAllUsers, selectIsUsersLoading} from "../model/selectors";
import AUsersMigration from "./AUsersMigration";
import Preloader from "../../../components/common/Preloader";
import Box from "@mui/material/Box";
import PageTemplate from "../../../components/templates/PageTemplate";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";

const UsersPage = () => {
    const users = useAppSelector(selectAllUsers);
    const isLoading = useAppSelector(selectIsUsersLoading);
    if (isLoading) {
        return <Preloader/>;
    }
    if (!users) {
        return null;
    }
    return (
        <PageTemplate>
            <PageHeaderTemplate title={"Сотрудники"}/>
            <UsersTable rows={users}/>
            <AUsersMigration/>
        </PageTemplate>
    );
};

export default UsersPage;
