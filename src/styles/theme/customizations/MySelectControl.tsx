import {
    FormControl, FormControlProps,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import {ChangeEvent, FC} from "react";

type Option = {
    id: string | number;
    title: string;
};

interface IProps extends Omit<FormControlProps, "error"> {
    value: string;
    name: string;
    label: string;
    options: Option[];
    changeHandler: (e: ChangeEvent<HTMLInputElement
            | HTMLTextAreaElement>
        | SelectChangeEvent<string | unknown>) => void;
    errorText?: string | null;
}

const MySelectControl: FC<IProps> = ({
                                         value,
                                         name,
                                         label,
                                         options,
                                         changeHandler,
                                         errorText = "",
                                         ...props
                                     }) => {
    const labelId = `${name}-label`;
    const selectId = `${name}-select`;
    return (
        <FormControl fullWidth sx={{position: "relative"}} {...props}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                labelId={labelId}
                id={selectId}
                name={name}
                label={label}
                value={value}
                variant={"outlined"}
                onChange={changeHandler}
            >
                <MenuItem key={"-1"} value={"-1"}>
                    Не выбрано
                </MenuItem>
                {options.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                        {opt.title}
                    </MenuItem>
                ))}
            </Select>
            <Typography variant="caption"
                        color="warning"
                        sx={{position: "absolute", right: 0, bottom: -23}}>
                {errorText}
            </Typography>
        </FormControl>
    );
};
export default MySelectControl;