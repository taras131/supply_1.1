import React from 'react';
import {Button, ButtonProps} from "@mui/material";

const MyButton = ({sx, ...props}: ButtonProps) => {
    return (
        <Button
            {...props}
            sx={{
                textTransform: 'none',
                ...(sx as any),
            }}
        />
    );
};

export default MyButton;