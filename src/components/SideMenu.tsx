import React from 'react';
import {Drawer, drawerClasses} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MenuContent from "./MenuContent";
import UserAvatar from "../features/users/ui/UserAvatar";
import {useAppSelector} from "../hooks/redux";
import {selectCurrentUser} from "../features/users/model/selectors";
import {drawerWidth} from "../utils/const";

const SideMenu = () => {
    const currentUser = useAppSelector(selectCurrentUser);
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
                display: { xs: 'none', md: 'block' },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    mt: 'calc(var(--template-frame-height, 0px) + 4px)',
                    p: 1.5,
                }}
            >
                {/*  <SelectContent />*/}
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