import React, {FC, useEffect, useState} from 'react';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

interface IProps {
    value: string | number;
    onChange: (value: string | number) => void;
    unit_measure?: string;
    type?: "text" | "number";
    placeholder?: string;
    maxWidth?: number;
}

const EditableInput: FC<IProps> = ({
                                       value,
                                       onChange,
                                       unit_measure = "",
                                       type = "text",
                                       placeholder = "Введите значение",
                                       maxWidth = 140,
                                   }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(String(value ?? ""));

    useEffect(() => {
        if (!isEditing) setInputValue(String(value ?? ""));
    }, [value, isEditing]);

    const handleSpanClick = () => setIsEditing(true);

    const handleBlur = () => {
        onChange(type === "number" ? +inputValue : inputValue);
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
        } else if (e.key === "Escape") {
            setInputValue(String(value ?? ""));
            setIsEditing(false);
        }
    };

    const isEmpty = !inputValue;

    return (
        <Box sx={{maxWidth, ml: "auto", display: "flex", alignItems: "center", height: "100%"}}>
            {isEditing ? (
                <TextField
                    type={type}
                    value={inputValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    variant="standard"
                    autoFocus
                    slotProps={{
                        input: {
                            style: {textAlign: "right"}
                        }
                    }}
                    sx={{width: "100%"}}
                    placeholder={placeholder}
                />
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        minHeight: 32,
                        textAlign: "right",
                        cursor: "pointer",
                        color: isEmpty ? "#9e9e9e" : "inherit",
                        display: "flex",
                        alignItems: "center",
                        height: "100%"
                    }}
                    onClick={handleSpanClick}
                    tabIndex={0}
                    role="button"
                >
                    {isEmpty ? placeholder : `${inputValue} ${type === "number" ? unit_measure : ""}`}
                </Box>
            )}
        </Box>
    );
};

export default EditableInput;