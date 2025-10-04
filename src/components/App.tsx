import React, {useEffect} from 'react';
import {Routes, Route} from "react-router-dom";
import {useAppDispatch} from "../hooks/redux";
import {fetchCheckAuth} from "../features/auth/model/actions";
import {fetchGetAllUsers} from "../features/users/model/actions";
import {alpha, CssBaseline, Stack, ThemeProvider} from "@mui/material";
import Box from "@mui/material/Box";
import {IRouteConfig, routesConfig} from "../config/routes";
import SideMenu from "./SideMenu";
import AppNavbar from "./AppNavbar";
import Header from "./Header";
import {theme} from "../styles/theme/theme";
import MessageWindow from "../features/messages/ui/MessageWindow";
import Message from "../features/messages/ui/Message";
import {fetchGetInvoicesStatistics} from "../features/invoices/model/actions";

function App() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchCheckAuth());
        dispatch(fetchGetAllUsers());
        dispatch(fetchGetInvoicesStatistics());
    }, [dispatch]);
    const getAllRoutes = (routes: IRouteConfig[]): IRouteConfig[] => {
        const result: IRouteConfig[] = [];
        routes.forEach(route => {
            result.push(route);
            if (route.children) {
                result.push(...getAllRoutes(route.children));
            }
        });
        return result;
    };
    const allRoutes = getAllRoutes(routesConfig);
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
                            {allRoutes.map(route => (
                                <Route key={route.path} path={route.path} element={route.element}/>
                            ))}
                        </Routes>
                    </Stack>
                </Box>
                <MessageWindow/>
                <Message/>
            </Box>
        </ThemeProvider>
    );
}

export default App;
