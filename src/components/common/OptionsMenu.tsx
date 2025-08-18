import { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {FC, ReactNode, useState} from 'react';
import MenuButton from './MenuButton';

interface IProps {
    children: ReactNode;
}

export const OptionsMenu:FC<IProps> = ({children}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <MenuButton aria-label="Open menu" onClick={handleClick} sx={{ borderColor: 'transparent' }}>
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
          {children}
      </Menu>
    </>
  );
}

export default OptionsMenu;

export {}