import React, {FC} from 'react';
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {IUser} from "../../../models/IUser";
import {getUserRoleById} from "../utils/services";
import Divider from "@mui/material/Divider";
import ListItemIcon, {listItemIconClasses} from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {styled} from "@mui/material/styles";
import MuiMenuItem from "@mui/material/MenuItem";
import {useAppDispatch} from "../../../hooks/redux";
import {fetchOut} from "../../auth/model/actions";
import {useNavigate} from "react-router-dom";
import {routes} from "../../../utils/routes";
import OptionsMenu from "../../../components/common/OptionsMenu";
import {fileServerPath} from "../../../api";

interface IProps {
    user: IUser;
}

const MenuItem = styled(MuiMenuItem)({
    margin: '2px 0',
    minWidth: 120,
});

const  UserAvatar: FC<IProps> = ({user}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const profileClickHandler = () => {
        navigate(routes.profile);
    }
    const settingsClickHandler = () => {
        navigate(routes.profile);
    }
    const logoutClickHandler = () => {
        dispatch(fetchOut())
    }
    return (
        <Stack
            direction="row"
            sx={{
                p: 2,
                gap: 1,
                alignItems: 'center',
                borderTop: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Avatar
                sizes="small"
                alt="Riley Carter"
                src={`${fileServerPath}/${user.avatar_path}`}
                sx={{width: 36, height: 36}}
            />
            <Box sx={{mr: 'auto'}}>
                <Typography variant="body2" sx={{fontWeight: 500, lineHeight: '16px'}}>
                    {`${user.first_name} ${user.middle_name}`}
                </Typography>
                <Typography variant="caption" sx={{color: 'text.secondary'}}>
                    {getUserRoleById(user.role_id)}
                </Typography>
            </Box>
            <OptionsMenu>
                <MenuItem onClick={profileClickHandler}>Профиль</MenuItem>
                <Divider/>
                <MenuItem onClick={settingsClickHandler}>Настройки</MenuItem>
                <Divider/>
                <MenuItem
                    onClick={logoutClickHandler}
                    sx={{
                        [`& .${listItemIconClasses.root}`]: {
                            ml: 'auto',
                            minWidth: 0,
                        },
                    }}
                >
                    <ListItemText>Выйти</ListItemText>
                    <ListItemIcon sx={{ml: 1}}>
                        <LogoutRoundedIcon fontSize="small"/>
                    </ListItemIcon>
                </MenuItem>
            </OptionsMenu>
        </Stack>
    );
};

export default UserAvatar;