import React from 'react';
import {routesConfig} from "../config/routes";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import {routes} from "../utils/routes";
import {matchPath, useLocation, useNavigate} from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import {useAppSelector} from "../hooks/redux";
import {selectIsAuth} from "../features/auth/model/selectors";

const MenuContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuth = useAppSelector(selectIsAuth);
    return (
        <Stack sx={{flexGrow: 1, p: 1, justifyContent: 'space-between'}}>
            <List dense>
                {
                    routesConfig
                        .filter(route => route.showInMenu)
                        .map((item, index) => {
                            // Проверка совпадения текущего location.pathname с item.path
                            const isSelected = matchPath(
                                {path: item.path, end: false},
                                location.pathname
                            );
                            return (
                                <ListItem key={index} disablePadding sx={{display: "block"}}>
                                    <ListItemButton
                                        selected={!!isSelected}
                                        onClick={() => navigate(item.path)}
                                    >
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.label}/>
                                    </ListItemButton>
                                </ListItem>
                            );
                        })
                }
            </List>
            <List dense>
                {!isAuth && (
                    <>
                        <ListItem key={routes.login} disablePadding sx={{display: 'block'}}>
                            <ListItemButton onClick={() => navigate(routes.login)}>
                                <ListItemIcon><LoginIcon/></ListItemIcon>
                                <ListItemText primary="Вход"/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={routes.register} disablePadding sx={{display: 'block'}}>
                            <ListItemButton onClick={() => navigate(routes.register)}>
                                <ListItemIcon><AppRegistrationIcon/></ListItemIcon>
                                <ListItemText primary="Регистрация"/>
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Stack>
    );
};

export default MenuContent;