import React, {useEffect} from 'react';
import {Routes, Route} from "react-router-dom";
import {useAppDispatch} from "../hooks/redux";
import {fetchCheckAuth} from "../features/auth/model/actions";
import {fetchGetAllUsers} from "../features/users/model/actions";
import {alpha, CssBaseline, Stack, ThemeProvider} from "@mui/material";
import Box from "@mui/material/Box";
import {routesConfig} from "../config/routes";
import SideMenu from "./SideMenu";
import AppNavbar from "./AppNavbar";
import Header from "./Header";
import {theme} from "../styles/theme/theme";
import ModalWindow from "./ModalWindow";
import MessageWindow from "../features/messages/ui/MessageWindow";

function App() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchCheckAuth());
        dispatch(fetchGetAllUsers());
    }, [dispatch]);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box sx={{
                display: 'flex',
                height: '100vh',
            }}>
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
                <MessageWindow />
            </Box>
        </ThemeProvider>
    );
}

export default App;
