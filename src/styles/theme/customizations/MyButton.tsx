import React from 'react';
import {Button, ButtonProps} from "@mui/material";

const MyButton = ({sx, ...props}: ButtonProps) => {
    return (
        <Button
            {...props}
            sx={{
                color: 'text.secondary',
                textTransform: 'none',
                '&:hover': {
                    color: 'text.primary',
                },
                ...(sx as any),
            }}
        />

    );
};

export default MyButton;