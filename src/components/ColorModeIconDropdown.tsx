import {useColorScheme} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import {FC} from "react";


const ColorModeIconDropdown: FC = () => {
    const {mode, setMode} = useColorScheme();
    return (
        <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} size="small">
            {mode === 'dark' ? <LightModeRounded/> : <DarkModeRounded/>}
        </IconButton>
    );
}

export default ColorModeIconDropdown