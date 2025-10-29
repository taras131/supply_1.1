import React, {useMemo, useState} from 'react';
import {IRouteConfig, routesConfig} from "../config/routes";
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
import {ExpandLess, ExpandMore} from '@mui/icons-material';
import Box from "@mui/material/Box";
import {Badge, Collapse} from "@mui/material";
import {selectInvoicesUnpaidCount} from "../features/invoices/model/selectors";
import {selectShipmentsCount} from "../features/shipments/model/selectors";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TechnicalLiteraturePage from "../features/technical_literature/ui/TechnicalLiteraturePage";

const MenuContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuth = useAppSelector(selectIsAuth);
    const invoiceUnPaidCount = useAppSelector(selectInvoicesUnpaidCount);
    const shipmentUnReceivingCount = useAppSelector(selectShipmentsCount);
    // Состояние для отслеживания открытых подменю
    const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
    // Функция для переключения состояния подменю
    const toggleSubmenu = (path: string) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [path]: !prev[path]
        }));
    };
    // Проверка, выбран ли элемент или его дочерние элементы
    const isItemSelected = (item: IRouteConfig): boolean => {
        // Проверяем текущий элемент
        const isCurrentSelected = !!matchPath(
            {path: item.path, end: false},
            location.pathname
        );
        // Проверяем дочерние элементы
        if (item.children) {
            const isChildSelected = item.children.some(child =>
                !!matchPath({path: child.path, end: false}, location.pathname)
            );
            return isCurrentSelected || isChildSelected;
        }
        return isCurrentSelected;
    };
    // Проверка, открыто ли подменю (автоматически открываем если выбран дочерний элемент)
    const isSubmenuOpen = (item: IRouteConfig): boolean => {
        const manuallyOpen = openSubmenus[item.path];
        const hasSelectedChild = item.children?.some(child =>
            !!matchPath({path: child.path, end: false}, location.pathname)
        );
        return manuallyOpen || hasSelectedChild || false;
    };
    // Рекурсивный компонент для рендеринга пунктов меню
    const renderMenuItem = (item: IRouteConfig, level: number = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isSelected = isItemSelected(item);
        const isOpen = isSubmenuOpen(item);
        const handleClick = () => {
            if (hasChildren) {
                toggleSubmenu(item.path);
            } else {
                navigate(item.path);
            }
        };
        let badgeCount: number | null = null;
        if (item.path === routes.invoices) {
            badgeCount = invoiceUnPaidCount;
        }
        if (item.path === routes.shipments) {
            badgeCount = shipmentUnReceivingCount;
        }
        return (
            <React.Fragment key={item.path}>
                <ListItem disablePadding sx={{display: "block"}}>
                    <ListItemButton
                        selected={isSelected && !hasChildren}
                        onClick={handleClick}
                        sx={{
                            pl: 2 + level * 2, // Отступ для вложенности
                            pr: 2,
                            borderRadius: 1,
                            mx: 0.5,
                            mb: 0.5,
                        }}
                    >
                        <ListItemIcon sx={{minWidth: 40}}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    fontSize: level > 0 ? '0.875rem' : '1rem',
                                    fontWeight: isSelected ? 600 : 400,
                                }
                            }}
                        />
                        {badgeCount !== null && (
                            <Badge
                                badgeContent={badgeCount}
                                color="primary"
                                overlap="circular"
                            />
                        )}
                        {hasChildren && (
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                {isOpen ? <ExpandLess/> : <ExpandMore/>}
                            </Box>
                        )}
                    </ListItemButton>
                </ListItem>

                {/* Рендеринг дочерних элементов */}
                {hasChildren && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding dense>
                            {item.children
                                ?.filter(child => child.showInMenu)
                                .map(child => renderMenuItem(child, level + 1))
                            }
                        </List>
                    </Collapse>
                )}
            </React.Fragment>
        );
    };

    // Фильтруем и рендерим главные пункты меню
    const mainMenuItems = useMemo(() =>
            routesConfig
                .filter(route => route.showInMenu)
                .map(item => renderMenuItem(item)),
        [routesConfig, location.pathname, openSubmenus, invoiceUnPaidCount, shipmentUnReceivingCount]
    );
    const downMenu = useMemo(() =>
            routesConfig
                .filter(route => route.showInDownMenu)
                .map(item => renderMenuItem(item)),
        [routesConfig, location.pathname]
    );
    return (
        <Stack sx={{flexGrow: 1, p: 1, justifyContent: 'space-between'}}>
            <List dense sx={{pt: 0}}>
                {mainMenuItems}
            </List>

            {/* Нижняя часть меню - авторизация */}
            <List dense>
                {downMenu}
                {!isAuth && (
                    <>
                        <ListItem disablePadding sx={{display: 'block'}}>
                            <ListItemButton
                                onClick={() => navigate(routes.login)}
                                sx={{
                                    borderRadius: 1,
                                    mx: 0.5,
                                    mb: 0.5,
                                }}
                            >
                                <ListItemIcon sx={{minWidth: 40}}>
                                    <LoginIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Вход"/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding sx={{display: 'block'}}>
                            <ListItemButton
                                onClick={() => navigate(routes.register)}
                                sx={{
                                    borderRadius: 1,
                                    mx: 0.5,
                                    mb: 0.5,
                                }}
                            >
                                <ListItemIcon sx={{minWidth: 40}}>
                                    <AppRegistrationIcon/>
                                </ListItemIcon>
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