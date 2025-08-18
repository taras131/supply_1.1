import React, { ChangeEvent, FC } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface IProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | number>) => void;
  options: Array<{ id: number | string; title: string | number }>;
}

const FilterSelect: FC<IProps> = ({ label, name, value, options, onChange }) => {
  return (
    <FormControl
      sx={{
        width: "200px",
        flexGrow: 1,
        m: 1,
      }}
    >
      <InputLabel id={name}>{label}</InputLabel>
      <Select
        id={name}
        name={name}
        value={value}
        label={label}
        onChange={onChange}
        variant="outlined"
        size="small"
        sx={{ width: "100%" }}
      >
        <MenuItem value={-1}>Все</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;
