import React, {ChangeEvent, FC} from "react";
import {FormControl, InputAdornment, SelectChangeEvent, SxProps, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";

interface IProps {
    label?: string;
    name: string;
    value: string | number;
    onChange: (e: | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string | number>) => void;
    onClear?: () => void; // необязательно: показать крестик для очистки
    sx?: SxProps;
    placeholder?: string; // если не задан — используем label
}

const SearchTextField: FC<IProps> = ({
                                         label,
                                         name,
                                         value,
                                         onChange,
                                         onClear,
                                         sx,
                                         placeholder,
                                     }) => {
    const showClear = Boolean(value) && typeof onClear === 'function';
    return (
        <FormControl
            sx={{
                minWidth: 170,
                flexGrow: 1,
                m: 1,
                ...sx,
            }}
        >
            <TextField
                id={name}
                name={name}
                type="text"
                label={label}
                hiddenLabel
                placeholder={placeholder ?? label}
                variant="outlined"
                size="small"
                value={value}
                onChange={onChange}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small"/>
                            </InputAdornment>
                        ),
                        endAdornment: showClear ? (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Очистить"
                                    edge="end"
                                    size="small"
                                    onClick={onClear}
                                >
                                    <CloseIcon fontSize="small"/>
                                </IconButton>
                            </InputAdornment>
                        ) : undefined,
                    },
                }}
                sx={{
                    // стиль плейсхолдера, чтобы выглядел как «лейбл на заднем плане»
                    '& .MuiInputBase-input::placeholder': {
                        color: 'text.secondary',
                        opacity: 1,
                    },
                }}
                // если хотите явно отключить автозаполнение
                autoComplete="off"
            />
        </FormControl>
    );
};
export default SearchTextField;