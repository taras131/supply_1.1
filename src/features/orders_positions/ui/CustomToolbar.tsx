import * as React from 'react';
import {Button, Box} from '@mui/material';
import {GridToolbarProps, Toolbar} from '@mui/x-data-grid';

type Extra = { onAdd?: () => void };
const CustomToolbar: React.FC<GridToolbarProps & Extra> = ({onAdd}) => {
    return (
        <Toolbar>
            <Button size="small" variant="contained" onClick={onAdd}>
                Добавить
            </Button>
            <Box sx={{flex: 1}}/>
        </Toolbar>
    );
};
export default CustomToolbar;