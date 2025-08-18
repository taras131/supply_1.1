import React, { FC } from "react";
import { TableHead, TableRow, useMediaQuery } from "@mui/material";
import {CENTER, LEFT, StyledTableCell} from "../../../styles/const";

interface IProps {
  isLimitedOverview: boolean;
}

const OrderPositionsListTableHeader: FC<IProps> = ({ isLimitedOverview }) => {
  const matches_1000 = useMediaQuery("(min-width:1000px)");
  const matches_700 = useMediaQuery("(min-width:700px)");
  return (
    <TableHead>
      <TableRow sx={{ padding: matches_700 ? "10px" : "2px" }}>
        <StyledTableCell sx={{ padding: matches_700 ? "8px" : "2px" }} align={CENTER}>
          №
        </StyledTableCell>
        <StyledTableCell sx={{ padding: matches_700 ? "8px" : "2px" }} align={LEFT}>
          Наименование
        </StyledTableCell>
        <StyledTableCell
          sx={{
            maxWidth: "150px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            padding: matches_700 ? "8px" : "2px",
          }}
        >
          {matches_700 ? "Каталожный номер" : "Номер"}
        </StyledTableCell>
        <StyledTableCell align={CENTER} sx={{ padding: matches_700 ? "8px" : "2px" }}>
          {matches_1000 ? "Количество" : "К_во"}
        </StyledTableCell>
        {!isLimitedOverview && matches_700 && (
          <StyledTableCell
            align={CENTER}
            sx={{
              maxWidth: "120px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              padding: matches_700 ? "8px" : "2px",
            }}
          >
            Комментарий
          </StyledTableCell>
        )}
        <StyledTableCell sx={{ padding: matches_700 ? "8px" : "2px" }} align={CENTER}>
          {matches_700 ? "Поставщик" : ""}
        </StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

export default OrderPositionsListTableHeader;
