import React, {ChangeEvent, FC} from 'react';
import {FormControl, FormControlProps, SelectChangeEvent, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";

interface IProps extends Omit<FormControlProps, "error"> {
    value: string | number;
    name: string;
    label: string;
    changeHandler: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | unknown>) => void;
    errorText?: string | null;
    type?: "number" | "text"
}

const MyFormControl: FC<IProps> = ({
                                       value,
                                       name,
                                       label,
                                       changeHandler,
                                       errorText = "",
                                       type,
                                       ...props
                                   }) => {
    return (
        <FormControl fullWidth sx={{position: "relative"}} {...props}>
            <TextField
                value={value}
                onChange={changeHandler}
                name={name}
                label={label}
                type={type ?? "text"}
            />
            <Typography variant="caption"
                        color="warning"
                        sx={{position: "absolute", right: 0, bottom: -23}}>
                {errorText}
            </Typography>
        </FormControl>
    );
};
export default MyFormControl;