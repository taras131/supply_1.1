import Stack from '@mui/material/Stack';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import {FC} from "react";
import ColorModeIconDropdown from "./ColorModeIconDropdown";

const Header: FC = () => {
    return (

        <Stack
            direction="row"
            sx={{
                display: {xs: 'none', md: 'flex'},
                width: '100%',
                alignItems: {xs: 'flex-start', md: 'center'},
                justifyContent: 'space-between',
                maxWidth: {sm: '100%', md: '1700px'},
                pt: 1.5,
            }}
            spacing={2}
        >
            <NavbarBreadcrumbs/>
            <Stack direction="row" sx={{gap: 1}}>
                <ColorModeIconDropdown/>
                {/*       <MenuButton showBadge aria-label="Open notifications">
                    <NotificationsRoundedIcon/>
                </MenuButton>*/}
            </Stack>
        </Stack>

    );
}

export default Header;