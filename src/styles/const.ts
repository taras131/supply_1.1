import { styled } from "@mui/material/styles";
import { Badge, BadgeProps, ListItemButton, TableCell, tableCellClasses, TableRow, TextField } from "@mui/material";

export const APPROVED_GRADIENT = "linear-gradient(90deg, rgba(141,176,227,1) 0%, rgba(121,151,193,1) 48%)";
export const SUCCESS_GRADIENT = "linear-gradient(90deg, rgba(139,196,143,1) 0%, rgba(107,164,114,1) 48%)";
export const CANCEL_GRADIENT = "linear-gradient(90deg, rgba(227,164,112,1) 0%, rgba(223,165,77,1) 48%)";
export const SUCCESS = "success";
export const INHERIT = "inherit";
export const SIZE_SMALL = "small";
export const LABEL = "label";
export const LOADING_BUTTON_BORDER_RADIUS = "25px";
export const CONTAINED_VARIANT = "contained";
export const COMPONENT_A = "a";
export const NONE = "none";
export const OUTLINED = "outlined";
export const CENTER = "center";
export const SPACE_BETWEEN = "space-between";
export const SPACE_AROUND = "space-around";
export const H3 = "h3";
export const H4 = "h4";
export const H5 = "h5";
export const H6 = "h6";
export const START = "start";
export const END = "end";
export const LEFT = "left";
export const RIGHT = "right";
export const COLUMN = "column";
export const ROW = "row";
export const HIDDEN = "hidden";
export const PRIMARY = "primary";
export const DIV = "div";
export const CONTAINED = "contained";
export const SMALL = "small";
export const LARGE = "large";
export const WHITE_COLOR = "white";
export const BLACK_COLOR = "black";
export const CURSOR_POINTER = "pointer";
export const FORM_CONTROL_HEIGHT_PX = "80px";
export const TEXT_FIELD_MAX_WIDTH_PX = "390px";
export const SECONDARY_TEXT_COLOR = "text.secondary";
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#272e3d",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
export const StyledTextField = styled(TextField)(() => ({
  "& input[type=number]": {
    MozAppearance: "textField",
  },
  "& input[type=number]::-webkit-outer-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "& input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
}));
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
export const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -20,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    marginLeft: "15px",
  },
}));

const baseColor = "#e3f2fd"; // очень мягкий голубой (MUI blue[50])
const hoverColor = "#bbdefb"; // чуть насыщеннее (MUI blue[100])
export const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  backgroundColor: baseColor,
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: hoverColor,
  },
}));
