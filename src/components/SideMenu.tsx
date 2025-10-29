import React from 'react';
import {Drawer, drawerClasses} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MenuContent from "./MenuContent";
import UserAvatar from "../features/users/ui/UserAvatar";
import {useAppSelector} from "../hooks/redux";
import {selectCurrentUser} from "../features/users/model/selectors";
import {drawerWidth} from "../utils/const";
import Stack from "@mui/material/Stack";
import {selectCurrentCompany} from "../features/companies/model/selectors";
import {fileServerPath} from "../api";

const SideMenu = () => {
    const currentUser = useAppSelector(selectCurrentUser);
    const company = useAppSelector(selectCurrentCompany);
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                boxSizing: 'border-box',
                mt: 10,
                [`& .${drawerClasses.paper}`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
                display: {xs: 'none', md: 'block'},
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    mt: 'calc(var(--template-frame-height, 0px) + 4px)',
                    p: 1.5,
                }}
            >
                <Stack
                    sx={{height: "30px", width: "100%", backgroundColor: 'transparent'}}
                    alignItems="center"
                    justifyContent="center"
                    direction="row"
                >
                    {company && (
                        <>
                            {company.logo_path && (
                                <img
                                    src={`${fileServerPath}/${company.logo_path}`}
                                    alt="Company Logo"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        objectFit: 'contain',
                                        backgroundColor: 'transparent',
                                        marginRight: "5px"
                                    }} // Фиксированный размер, сохранение пропорций
                                />
                            )}
                            {company.name}
                        </>
                    )}
                </Stack>
            </Box>
            <Divider/>
            <Box
                sx={{
                    overflow: 'auto',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <MenuContent/>
            </Box>
            {currentUser && (
                <UserAvatar user={currentUser}/>
            )}
        </Drawer>
    );
};

export default SideMenu;