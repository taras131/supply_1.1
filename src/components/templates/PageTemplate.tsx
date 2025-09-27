import React, {FC} from 'react';
import {Stack} from "@mui/material";

interface IProps {
    children?: React.ReactNode;
}

const PageTemplate:FC<IProps> = ({children}) => {
    return (
        <Stack sx={{
            width: '100%',
            maxWidth: {sm: '100%', md: '1700px'},
        }}
        spacing={3}
               pt={1}
        >
            {children}
        </Stack>
    );
};

export default PageTemplate;