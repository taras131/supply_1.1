import React, {useEffect} from 'react';
import Stack from '@mui/material/Stack';
import SideMenu from '../dashboard/components/SideMenu';
import AppNavbar from '../dashboard/components/AppNavbar';
import Header from '../dashboard/components/Header';
import AppTheme from '../shared-theme/AppTheme';
import {alpha} from '@mui/material/styles';
import {
    datePickersCustomizations,
    treeViewCustomizations,
    dataGridCustomizations,
} from '../dashboard/theme/customizations';
import Box from "@mui/material/Box";
import {CssBaseline} from "@mui/material";
import {routesConfig} from "../config/routes";
import {Routes, Route} from "react-router-dom";
import {useAppDispatch} from "../hooks/redux";
import {fetchCheckAuth} from "../features/auth/model/actions";
import {fetchGetAllUsers} from "../features/users/model/actions";

const xThemeComponents = {
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

function App() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchCheckAuth());
        dispatch(fetchGetAllUsers());
    }, [dispatch]);
    return (
        <Box sx={{display: 'flex'}}>
            <SideMenu/>
            <AppNavbar/>
            <Box
                component="main"
                sx={(theme) => ({
                    flexGrow: 1,
                    backgroundColor: theme.vars
                        ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                        : alpha(theme.palette.background.default, 1),
                    overflow: 'auto',
                })}
            >
                <Stack
                    spacing={2}
                    sx={{
                        alignItems: 'center',
                        mx: 3,
                        pb: 5,
                        mt: {xs: 8, md: 0},
                    }}
                >
                    <Header/>
                    <Routes>
                        {routesConfig.map(route => (
                            <Route key={route.path} path={route.path} element={route.element}/>))}
                    </Routes>
                </Stack>
            </Box>
        </Box>
    );
}

export default App;
