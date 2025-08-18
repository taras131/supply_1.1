import React from "react";
import {useAppSelector} from "../../../hooks/redux";
import {Stack, Typography} from "@mui/material";
import UsersTable from "./UsersTable";
import {selectAllUsers, selectIsUsersLoading} from "../model/selectors";
import AUsersMigration from "./AUsersMigration";
import Preloader from "../../../components/common/Preloader";
import Box from "@mui/material/Box";

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
        <Box sx={{width: '100%', maxWidth: {sm: '100%', md: '1700px'}}}>
            <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center" sx={{mb: 2, mt: 2}}>
                <Typography component="h2" variant="h6">
                    Сотрудники
                </Typography>
                <div>

                </div>
            </Stack>
            <UsersTable rows={users}/>
            <AUsersMigration/>
        </Box>
    );
};

export default UsersPage;
