import { ChangeEvent, FC } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  Typography,
} from "@mui/material";

const StyledInput = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "isError",
})<{ isError?: boolean }>(({ theme, isError }) => ({
  "label + &": {
    marginTop: theme.spacing(2),
  },

  // Только фон, бордер — нельзя!
  "& .MuiInputBase-input": {
    borderRadius: 10,
    position: "relative",
    backgroundColor: isError ? "#FFFBE6" : "#E8F5E9",
    fontSize: 16,
    padding: "10px 12px",
    transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    ...theme.applyStyles("dark", {
      backgroundColor: isError ? "hsl(45, 90%, 35%)" : "#1B5E20",
    }),
  },

  "& .MuiInputBase-inputMultiline": {
    borderRadius: 10,
    backgroundColor: isError ? "#FFFBE6" : "#E8F5E9",
    padding: "10px 12px",
    boxSizing: "border-box",
    fontSize: 16,
    ...theme.applyStyles("dark", {
      backgroundColor: isError ? "#423A00" : "#1B5E20",
    }),
  },

  "& .MuiOutlinedInput-root": {
    backgroundColor: isError ? "#FFFBE6" : "#E8F5E9",
    borderRadius: 10,
    // Бордер — только здесь!
    border: "1px solid",
    borderColor: isError ? "#FFC107" : "#4CAF50",
    ...theme.applyStyles("dark", {
      backgroundColor: isError ? "#423A00" : "#1B5E20",
      borderColor: isError ? "#FFD54F" : "#66BB6A",
    }),
  },

  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: 10,
    borderColor: isError ? "#FFC107" : "#4CAF50",
    borderWidth: "1px",
    ...theme.applyStyles("dark", {
      borderColor: isError ? "#FFD54F" : "#66BB6A",
    }),
  },
}));

const StyledSelect = styled(Select, {
  shouldForwardProp: (prop) => prop !== "isError",
})<{ isError?: boolean }>(({ theme, isError }) => ({
  "label + &": {
    marginTop: theme.spacing(2),
  },
  "& .MuiInputBase-input": {
    borderRadius: 10,
    position: "relative",
    backgroundColor: isError ? "#FFFBE6" : "#E8F5E9",
    border: "1px solid",
    borderColor: isError ? "#FFC107" : "#4CAF50",
    fontSize: 16,
    padding: "10px 12px",
    transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    ...theme.applyStyles("dark", {
      backgroundColor: isError ? "hsl(45, 90%, 35%)" : "#1B5E20",
      borderColor: isError ? "#FFD54F" : "#66BB6A",
    }),
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginLeft: theme.spacing(1.7),
  fontWeight: 600,
  whiteSpace: 'pre-wrap',
}));

const StyledLabel = styled(InputLabel)(() => ({
  fontSize: "18px",
  fontWeight: 500,
  marginLeft: "-10px",
}));

interface IProps {
  label: string;
  name: string;
  id: string;
  value: string | number;
  error?: string | null | undefined;
  isEditMode?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | unknown>) => void;
  options?: Array<{ id: number | string; title: string | number }>;
  isRequired?: boolean;
  isMultiline?: boolean; // Новый пропс для многострочного режима
  rows?: number;
  sx?: SxProps;
  disabled?: boolean;
}

const FieldControl: FC<IProps> = ({
  label,
  name,
  id,
  value,
  error = null,
  isEditMode = true,
  onChange,
  options,
  isRequired = false,
  isMultiline = false,
  rows = 3,
  sx,
  disabled = false,
}) => (
  <FormControl fullWidth sx={sx}>
    <StyledLabel required={isRequired} shrink htmlFor={id}>
      {label}
    </StyledLabel>
    {isEditMode ? (
      options ? (
        <StyledSelect
          variant="outlined"
          value={value}
          onChange={onChange}
          sx={{ overflow: "hidden" }}
          name={name}
          id={id}
          isError={!!error}
          disabled={disabled}
        >
          <MenuItem value={"-1"}>Не выбрано</MenuItem>
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.title}
            </MenuItem>
          ))}
        </StyledSelect>
      ) : (
        <StyledInput
          variant="outlined"
          value={value}
          onChange={onChange}
          name={name}
          id={id}
          isError={!!error}
          multiline={isMultiline}
          rows={isMultiline ? rows : undefined}
          disabled={disabled}
        />
      )
    ) : (
      <StyledTypography>
        {options ? options.find((option) => option.id === value)?.title || "-------" : value || "-------"}
      </StyledTypography>
    )}
    {isEditMode && <FormHelperText sx={{ minHeight: "20px", textAlign: "right" }}>{error}</FormHelperText>}
  </FormControl>
);

export default FieldControl;
