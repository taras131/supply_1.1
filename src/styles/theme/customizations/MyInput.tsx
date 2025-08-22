import React, {FC} from 'react';
import {InputProps} from "@mui/material";
import TextField from "@mui/material/TextField";

const MyInput:FC = ({sx, ...props}: InputProps) => {
    return (
        <TextField/>
    );
};

export default MyInput;