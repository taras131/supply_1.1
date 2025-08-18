import React, { FC, useId } from "react";
import { Checkbox, Chip, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { setMessage } from "../../messages/model/slice";
import {RootState} from "../../../store";
import {IOrderPosition} from "../../../models/IOrdersPositions";

interface IProps {
  index: number;
  isEdit: boolean;
  isLimitedOverview: boolean;
  isSelectPositionMode: boolean;
  orderId: string;
  orderItem: IOrderPosition;
}

const OrderPositionsListItem: FC<IProps> = ({
  orderItem,
  isEdit,
  index,
  isSelectPositionMode,
  orderId,
  isLimitedOverview,
}) => {
/*  const positionCheckBoxId = useId();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const matches_700 = useMediaQuery("(min-width:700px)");
  const matches_500 = useMediaQuery("(min-width:500px)");
  const isPositionSelected = useAppSelector((state: RootState) => getIsPositionSelected(state, orderId, orderItem.id));
  const supplierName = useAppSelector((state: RootState) => {
    if (orderItem.invoiceId && orderItem.invoiceId.length && orderItem.invoiceId.length > 4) {
      return getSupplierNameByInvoiceId(state, orderItem.invoiceId);
    } else {
      return "";
    }
  });
  const handleSelectPosition = () => {
    dispatch(setSelectedOrderPosition({ orderId: orderId, positionId: orderItem.id }));
  };
  const handleInvoiceClick = () => {
    if (orderItem.invoiceId) {
      navigate(`${routes.invoices}/${orderItem.invoiceId}`, { state: { from: routes.orders } });
    }
  };
  const handleInputChange = (e: any) => {
    dispatch(
      updateItemsValues({
        id: orderItem.id,
        name: e.target.name,
        newValue: e.target.value,
      }),
    );
  };
  const handleCountChange = (e: any) => {
    const value = +e.target.value;
    if (value > 0) {
      dispatch(updateItemsCount({ id: orderItem.id, newValue: value }));
    }
  };
  const handleMinusClick = () => {
    dispatch(updateItemsCount({ id: orderItem.id, newValue: orderItem.count - 1 }));
  };
  const handlePlusClick = () => {
    dispatch(updateItemsCount({ id: orderItem.id, newValue: orderItem.count + 1 }));
  };
  const handleRemoveClick = () => {
    if (orderItem.id !== 0) {
      dispatch(removeOrderItem(orderItem.id));
    }
  };
  const handleNameClick = () => {
    navigator.clipboard.writeText(`${orderItem.name} ${orderItem.catalogNumber}`);
    dispatch(setMessage({ text: "полное название скопировано", severity: MESSAGE_SEVERITY.success }));
  };
  const handleNumberClick = () => {
    navigator.clipboard.writeText(orderItem.catalogNumber);
    dispatch(setMessage({ text: "номер скопирован", severity: MESSAGE_SEVERITY.success }));
  };*/
  return (
      <Typography>Item</Typography>
/*    <StyledTableRow sx={{ width: "100%" }}>
      <StyledTableCell component="th" scope="row" sx={{ padding: matches_700 ? "8px" : "2px" }} align={CENTER}>
        {index + 1}
      </StyledTableCell>
      <StyledTableCell sx={{ padding: matches_700 ? "8px" : "2px" }}>
        {isEdit ? (
          <TextField fullWidth name={"name"} value={orderItem.name} variant="standard" onChange={handleInputChange} />
        ) : (
          <Stack
            sx={{ width: "100%", cursor: CURSOR_POINTER }}
            direction={ROW}
            alignItems={CENTER}
            justifyContent={SPACE_BETWEEN}
            spacing={1}
            onClick={handleNameClick}
          >
            <Typography>{orderItem.name}</Typography>
            {matches_700 && <ContentCopyIcon color={SUCCESS} />}
          </Stack>
        )}
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
        {isEdit ? (
          <TextField
            name={"catalogNumber"}
            value={orderItem.catalogNumber}
            variant="standard"
            onChange={handleInputChange}
            fullWidth
          />
        ) : (
          <Stack
            sx={{ width: "100%", cursor: CURSOR_POINTER }}
            direction={ROW}
            alignItems={CENTER}
            justifyContent={SPACE_BETWEEN}
            spacing={1}
            onClick={handleNumberClick}
          >
            <Typography>{orderItem.catalogNumber}</Typography>
            {matches_700 && <ContentCopyIcon color={SUCCESS} />}
          </Stack>
        )}
      </StyledTableCell>
      <StyledTableCell align={CENTER} sx={{ padding: matches_700 ? "8px" : 0 }}>
        {isEdit ? (
          <Stack direction={ROW} alignItems={CENTER} justifyContent={CENTER} spacing={matches_700 ? 1 : 0}>
            {matches_500 && (
              <IconButton aria-label="minus" onClick={handleMinusClick} disabled={orderItem.count < 2}>
                <RemoveIcon />
              </IconButton>
            )}
            <StyledTextField
              name={"count"}
              value={orderItem.count}
              inputProps={{ style: { textAlign: "center" } }}
              type={"number"}
              variant="standard"
              sx={{ width: "60px" }}
              onChange={handleCountChange}
            />
            {matches_500 && (
              <IconButton aria-label="plus" onClick={handlePlusClick}>
                <AddIcon />
              </IconButton>
            )}
          </Stack>
        ) : (
          orderItem.count
        )}
      </StyledTableCell>
      {!isLimitedOverview && matches_700 && (
        <StyledTableCell
          sx={{
            maxWidth: "120px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            padding: matches_700 ? "8px" : "2px",
          }}
        >
          {isEdit ? (
            <TextField
              fullWidth
              name={"comment"}
              value={orderItem.comment}
              variant="standard"
              onChange={handleInputChange}
            />
          ) : (
            orderItem.comment
          )}
        </StyledTableCell>
      )}
      <StyledTableCell align={CENTER} sx={{ padding: matches_700 ? "8px" : 0 }}>
        {isEdit && (
          <IconButton aria-label="delete" onClick={handleRemoveClick} disabled={orderItem.id === 1}>
            <DeleteIcon />
          </IconButton>
        )}
        {isSelectPositionMode && (
          <Checkbox
            id={positionCheckBoxId}
            checked={isPositionSelected}
            onChange={handleSelectPosition}
            inputProps={{ "aria-label": "controlled" }}
          />
        )}
        {!isEdit && !isSelectPositionMode && (
          <>
            {orderItem.invoiceId && (
              <>
                {matches_700 ? (
                  <Chip onClick={handleInvoiceClick} label={extractAllText(supplierName)} color={PRIMARY} />
                ) : (
                  <IconButton onClick={handleInvoiceClick} color={PRIMARY}>
                    <ReceiptIcon />
                  </IconButton>
                )}
              </>
            )}
            {!orderItem.completionType && !orderItem.invoiceId && (
              <OrderPositionsListItemMenu orderId={orderId} orderItemId={orderItem.id} />
            )}
            {!orderItem.invoiceId && orderItem.completionType && (
              <Typography>
                {orderItem.completionType === CompletionType.Cash && "За наличные"}
                {orderItem.completionType === CompletionType.Balance && "За баланс"}
              </Typography>
            )}
          </>
        )}
      </StyledTableCell>
    </StyledTableRow>*/
  );
};

export default OrderPositionsListItem;
