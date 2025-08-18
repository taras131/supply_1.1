import React, { ChangeEvent, FC } from "react";
import { FormControl, InputAdornment, SelectChangeEvent, SxProps, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface IProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | number>) => void;
  sx?: SxProps;
}

const SearchTextField: FC<IProps> = ({ label, name, value, onChange, sx }) => {
  return (
    <FormControl
      sx={{
        minWidth: "170px",
        flexGrow: 1,
        m: 1,
        ...sx,
      }}
    >
      <TextField
        id={name}
        name={name}
        label={label}
        variant="outlined"
        value={value}
        onChange={onChange}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
};

export default SearchTextField;
