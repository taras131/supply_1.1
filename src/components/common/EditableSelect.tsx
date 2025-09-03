import React, { useState, useEffect } from "react";
import { Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface IEditableSelectProps<T extends string | number> {
    value: T;
    onChange: (value: T) => void;
    options: T[];
    optionLabels?: Record<T, string>; // можно подписи к значениям
    placeholder?: string;
    maxWidth?: number;
}

const EditableSelect = <T extends string | number>({
                                                       value,
                                                       onChange,
                                                       options,
                                                       optionLabels,
                                                       placeholder = "Выберите значение",
                                                       maxWidth = 180
                                                   }: IEditableSelectProps<T>) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState<T | "">(value);

    useEffect(() => {
        if (!isEditing) setCurrentValue(value);
    }, [value, isEditing]);

    const handleSpanClick = () => setIsEditing(true);

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleChange = (e: SelectChangeEvent<T | "">) => {
        const val = e.target.value as T;
        setCurrentValue(val);
        onChange(val);
        setIsEditing(false);
    };

    const isEmpty = !currentValue && currentValue !== 0;

    return (
        <Box sx={{ maxWidth, ml: "auto", display: "flex", alignItems: "center", height: "100%" }}>
            {isEditing ? (
                <Select
                    autoFocus
                    open
                    value={currentValue}
                    onChange={handleChange}
                    onClose={handleBlur}
                    variant="standard"
                    sx={{ width: "100%" }}
                >
                    {options.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                            {optionLabels?.[opt] ?? opt}
                        </MenuItem>
                    ))}
                </Select>
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
                    {isEmpty ? placeholder : (optionLabels?.[currentValue as T] ?? currentValue)}
                </Box>
            )}
        </Box>
    );
};

export default EditableSelect;